import { LabelConfirmationPOJO, PickupCancellationConfirmationPOJO, PickupConfirmationPOJO, RateQuotePOJO } from "../../pojos/carrier";
import { Transaction } from "../common";
import { LabelSpec } from "./labels/label-spec";
import { PickupCancellation } from "./pickups/pickup-cancellation";
import { PickupRequest } from "./pickups/pickup-request";
import { RateCriteria } from "./rates/rate-criteria";
import { TrackingCriteria } from "./tracking/tracking-criteria";

/**
 * Creates a shipping label
 */
export type CreateLabel = (transaction: Transaction, label: LabelSpec)
  => LabelConfirmationPOJO | Promise<LabelConfirmationPOJO>;

/**
 * Voids one or more previously-created shipping labels
 */
export type VoidLabels = (transaction: Transaction, params: unknown) => void | Promise<void>;

/**
 * Gets shipping rates for a shipment
 */
export type GetRates = (transaction: Transaction, criteria: RateCriteria) => RateQuotePOJO | Promise<RateQuotePOJO>;

/**
 * Returns tracking information for a shipment
 */
export type Track = (transaction: Transaction, criteria: TrackingCriteria) => void | Promise<void>;

/**
 * Creates a manifest for multiple shipments
 */
export type CreateManifest = (transaction: Transaction, params: unknown) => void | Promise<void>;

/**
 * Schedules a package pickup at a time and place
 */
export type SchedulePickup = (transaction: Transaction, request: PickupRequest)
  => PickupConfirmationPOJO | Promise<PickupConfirmationPOJO>;

/**
 * Cancels a previously-requested package pickup
 */
export type CancelPickup = (transaction: Transaction, cancellation: PickupCancellation)
  => void | PickupCancellationConfirmationPOJO | Promise<PickupCancellationConfirmationPOJO | void>;
