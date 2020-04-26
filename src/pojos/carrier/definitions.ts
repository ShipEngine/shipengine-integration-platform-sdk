// tslint:disable: no-empty-interface
import { CancelPickup, CreateLabel, CreateManifest, GetRates, GetTrackingURL, RequestPickup, Track, VoidLabel } from "../../classes/carrier/methods";
import { Country } from "../../countries";
import { CarrierDefinition, DeliveryConfirmationDefinition, DeliveryServiceDefinition, PackagingDefinition, PickupServiceDefinition } from "../../definitions";
import { LogoPOJO } from "../common";

/**
 * A carrier that provides delivery services
 */
export interface CarrierPOJO extends CarrierDefinition {
  logo: LogoPOJO;
  deliveryServices: DeliveryServicePOJO[];
  pickupServices?: PickupServicePOJO[];
  requestPickup?: RequestPickup;
  cancelPickup?: CancelPickup;
  createLabel?: CreateLabel;
  voidLabel?: VoidLabel;
  getRates?: GetRates;
  getTrackingURL?: GetTrackingURL;
  track?: Track;
  createManifest?: CreateManifest;
}

/**
 * Delivery confirmation options offered by a carrier
 */
export interface DeliveryConfirmationPOJO extends DeliveryConfirmationDefinition {}

/**
 * A delivery service that is offered by a carrier
 */
export interface DeliveryServicePOJO extends DeliveryServiceDefinition {
  originCountries: Country[];
  destinationCountries: Country[];
  packaging?: PackagingPOJO[];
  deliveryConfirmations?: DeliveryConfirmationPOJO[];
}

/**
 * Describes a type of packaging
 */
export interface PackagingPOJO extends PackagingDefinition {}

/**
 * A package pickup service that is offered by a carrier
 */
export interface PickupServicePOJO extends PickupServiceDefinition {}