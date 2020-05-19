import { ChargePOJO, DateTimeZonePOJO, NotePOJO, TimeRangePOJO } from "../../common";
import { DeliveryServiceIdentifierPOJO } from "../delivery-service-pojo";
import { FulfillmentService } from "../fulfillment-service";
import { RatePackagePOJO } from "./rate-package";

/**
 * A quoted shipping rate based on the specified rate criteria
 */
export interface RatePOJO {
  /**
   * The delivery service this rate is for
   */
  deliveryService: DeliveryServiceIdentifierPOJO;

  /**
   * If the rate will be fulfilled using a well-known third-party carrier, such as UPS, FedEx, DHL, etc.
   * then specify the carrier service here.
   */
  fulfillmentService?: FulfillmentService;

  /**
   * The date/time that the package is expected to ship.
   * This is not guaranteed to be in the future.
   */
  shipDateTime?: DateTimeZonePOJO | Date | string;

  /**
   * The estimated date and time the shipment will be delivered
   */
  deliveryDateTime?: DateTimeZonePOJO | Date | string;

  /**
   * The minimum number of days delivery will take
   */
  minimumDeliveryDays?: number;

  /**
   * The maximum number of days delivery will take
   */
  maximumDeliveryDays?: number;

  /**
   * The expected delivery window
   */
  deliveryWindow?: TimeRangePOJO;

  /**
   * Certain carriers base their rates off of zone numbers that vary based on the origin and destination
   *
   * @see https://stamps.custhelp.com/app/answers/detail/a_id/6118/~/all-about-usps-postal-zones
   */
  zone?: number;

  /**
   * Indicates whether this rate is based on pre-negotiated terms
   */
  isNegotiatedRate?: boolean;

  /**
   * Indicates whether the carrier guarantees delivery by the `deliveryDateTime`
   */
  isGuaranteed?: boolean;

  /**
   * Indicates whether tracking numbers are provided
   */
  isTrackable?: boolean;

  /**
   * The breakdown of charges for this rate.
   * If the carrier does not provide a detailed breakdown, then just use a single
   * charge of type "shipping".
   */
  charges: ReadonlyArray<ChargePOJO>;

  /**
   * Human-readable information regarding this rate quote, such as limitations or restrictions
   */
  notes?: string | ReadonlyArray<string | NotePOJO>;

  /**
   * The list of packages in the shipment
   */
  packages: ReadonlyArray<RatePackagePOJO>;
}
