import { PaymentMethod, SalesOrder as SalesOrderPOJO, SalesOrderStatus, SalesOrderChargesPOJO, MonetaryValuePOJO, ShipEngineError, ErrorCode } from "../../public";
import { AddressWithContactInfo, calculateTotalCharges, Charge, DateTimeZone, hideAndFreeze, Joi, MonetaryValue, Note, _internal, error } from "../common";
import { Buyer } from "./buyer";
import { SalesOrderIdentifier, SalesOrderIdentifierBase } from "./sales-order-identifier";
import { SalesOrderItem } from "./sales-order-item";
import { ShippingPreferences } from "./shipping-preferences";


export interface SalesOrderCharges {
  subtotal?: MonetaryValue;
  taxAmount?: MonetaryValue;
  shippingAmount?: MonetaryValue;
  shippingCost?: MonetaryValue;
  confirmationCost?: MonetaryValue;
  insuranceCost?: MonetaryValue;
  otherCost?: MonetaryValue;
}


export class SalesOrder extends SalesOrderIdentifierBase {
  public static readonly [_internal] = {
    label: "sales order",
    schema: SalesOrderIdentifier[_internal].schema.keys({
      createdDateTime: DateTimeZone[_internal].schema.required(),
      status: Joi.string().enum(SalesOrderStatus).required(),
      paymentMethod: Joi.string().enum(PaymentMethod),
      orderURL: Joi.alternatives(Joi.object().website(), Joi.string().website()),
      shipTo: AddressWithContactInfo[_internal].schema.required(),
      buyer: Buyer[_internal].schema.required(),
      shippingPreferences: ShippingPreferences[_internal].schema,
      adjustments: Joi.array().min(1).items(Charge[_internal].schema),
      items: Joi.array().min(1).items(SalesOrderItem[_internal].schema).required(),
      notes: Note[_internal].notesSchema,
      metadata: Joi.object(),
    }),
  };

  public readonly createdDateTime: DateTimeZone;
  public readonly status: SalesOrderStatus;
  public readonly paymentMethod?: PaymentMethod;
  public readonly orderURL?: URL;
  public readonly shipTo: AddressWithContactInfo;
  public readonly buyer: Buyer;
  public readonly shippingPreferences: ShippingPreferences;
  public readonly adjustments: readonly Charge[];

  public readonly charges?: {
    subtotal?: MonetaryValue;
    taxAmount?: MonetaryValue;
    shippingAmount?: MonetaryValue;
    shippingCost?: MonetaryValue;
    confirmationCost?: MonetaryValue;
    insuranceCost?: MonetaryValue;
    otherCost?: MonetaryValue;
  };

  public readonly totalAdjustments: MonetaryValue;
  public readonly totalCharges: MonetaryValue;
  public readonly items: readonly SalesOrderItem[];
  public readonly notes: readonly Note[];
  public readonly metadata: object;

  public constructor(pojo: SalesOrderPOJO) {
    super(pojo);

    this.createdDateTime = new DateTimeZone(pojo.createdDateTime);
    this.status = pojo.status;
    this.paymentMethod = pojo.paymentMethod;
    this.orderURL = pojo.orderURL ? new URL(pojo.orderURL as string) : undefined;
    this.shipTo = new AddressWithContactInfo(pojo.shipTo);
    this.buyer = new Buyer(pojo.buyer);
    this.shippingPreferences = new ShippingPreferences(pojo.shippingPreferences || {});
    this.adjustments = pojo.adjustments ? pojo.adjustments.map((charge) => new Charge(charge)) : [];
    this.totalAdjustments = calculateTotalCharges(this.adjustments);
    this.totalCharges = calculateTotalSalesOrderCharges(this.charges);
    this.items = pojo.items.map((item) => new SalesOrderItem(item));
    this.notes = pojo.notes || [];
    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}

/**
 * Add up all of the optional sales order charges, if any.
 */
function calculateTotalSalesOrderCharges(charges?: SalesOrderChargesPOJO): MonetaryValue {

  if (!charges) {
    return new MonetaryValue({
      currency: "usd",
      value: 0
    });
  }

  const salesOrderChargeKeys = ["subTotal", "taxAmount", "shippingAmount", "shippingCost", "confirmationCost", "insuranceCost", "otherCost"];

  try {
    let insuredValues = salesOrderChargeKeys.map((key) => {
      return Reflect.get(charges, key) as MonetaryValuePOJO | undefined;
    });

    insuredValues = insuredValues.filter(value => value !== undefined);
    return MonetaryValue.sum(insuredValues as MonetaryValue[]);
  }
  catch (originalError) {
    // Check for a currency mismatch, and throw a more specific error message
    if ((originalError as ShipEngineError).code === ErrorCode.CurrencyMismatch) {
      throw error(
        ErrorCode.CurrencyMismatch,
        "All charges must be in the same currency.",
        { originalError }
      );
    }

    throw originalError;
  }
}