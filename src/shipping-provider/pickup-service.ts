import { humanize } from "@jsdevtools/humanize-anything";
import { ono } from "@jsdevtools/ono";
import { assert } from "../assert";
import { CarrierConfig, PickupServiceConfig } from "../config";
import { readArrayConfig, readConfig } from "../read-config";
import { InlineOrReference, InlineOrReferenceArray, UUID } from "../types";
import { Carrier } from "./carrier";
import { getCwd } from "../file-utils";

/**
 * A package pickup service that is offered by a shipping provider
 */
export class PickupService {
  /**
   * A UUID that uniquely identifies the pickup service.
   * This ID should never change, even if the service name changes.
   */
  public readonly id: UUID;

  /**
   * The user-friendly service name (e.g. "One-Time Pickup", "Recurring Pickup", "Drop-Off")
   */
  public readonly name: string;

  /**
   * A short, user-friendly description of the service
   */
  public readonly description: string;

  /**
   * The carrier that provides this service
   */
  public readonly carrier: Carrier;

  /**
   * Creates a PickupService object from a fully-resolved config object
   */
  public constructor(config: PickupServiceConfig) {
    assert.type.object(config, "pickup service");
    this.id = assert.string.uuid(config.id, "pickup service ID");
    this.name = assert.string.nonWhitespace(config.name, "pickup service name");
    this.description = assert.string(config.description, "pickup service description", "");
    this.carrier = new Carrier(config.carrier as CarrierConfig);

    // Prevent modifications after validation
    Object.freeze(this);
  }

  /**
   * Reads the config for a pickup service
   */
  public static async readConfig(config: InlineOrReference<PickupServiceConfig>, cwd = ".")
    : Promise<PickupServiceConfig> {
    try {

      config = await readConfig(config, cwd);

      return {
        ...config,
        carrier: await Carrier.readConfig(config.carrier, cwd)
      };

    }
    catch (error) {
      throw ono(error, `Error reading the pickup service config: ${humanize(config)}`);
    }
  }

  /**
   * Reads the config for an array of pickup services
   */
  public static async readArrayConfig(config: InlineOrReferenceArray<PickupServiceConfig>, cwd = ".")
    : Promise<PickupServiceConfig[]> {
    try {

      const arrayItemCwd = getCwd(config, cwd);
      const arrayConfig = await readArrayConfig(config, "pickup_services", cwd);
      const dereferencedArray = [];

      for (let item of arrayConfig) {
        const dereferencedConfig = await PickupService.readConfig(item, arrayItemCwd);
        dereferencedArray.push(dereferencedConfig);
      }
      return dereferencedArray;
    }
    catch (error) {
      throw ono(error, `Error reading the pickup service config: ${humanize(config)}`);
    }
  }
}