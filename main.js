var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};

// src/database.ts
import { world } from "@minecraft/server";
var objArrSignature, Database;
var init_database = __esm({
  "src/database.ts"() {
    objArrSignature = "gmson";
    Database = class {
      dynamicProperty;
      localState = /* @__PURE__ */ new Map();
      /**
       * @name setValue
       * @param {string} key The key string in which the value will be set in the local state.
       * @param {any} value The value string, number, or boolean from the dynamic property which will be set in the local state.
       * @remarks Sets the value with its key in the local state.
       */
      setValue(key, value) {
        if (typeof value === "string") {
          const parsedValue = this.parseValue(value);
          this.localState.set(key, parsedValue);
        } else
          this.localState.set(key, value);
      }
      /**
       * @name parseValue
       * @param {string} value The string value which needs to be checks if it is an array or an object.
       * @remarks Parses the stringify array or object value to an array or an object if it has the signature.
       * @returns {string | object | any[]} Returns an object or an array if the value is actually stringify object or array, and has signature. Otherwise returns the string value.
       */
      parseValue(value) {
        try {
          const parsedValue = JSON.parse(value);
          if (Array.isArray(parsedValue)) {
            const lastElement = parsedValue.pop();
            if (lastElement && lastElement.startsWith("papiDatabase:") && lastElement.endsWith(objArrSignature))
              return parsedValue;
            else
              return value;
          } else if (typeof parsedValue === "object" && parsedValue.papiDatabase === objArrSignature) {
            delete parsedValue.papiDatabase;
            return parsedValue;
          } else
            return value;
        } catch {
          return value;
        }
      }
      /**
       * @name constructor
       * @param {string} id An identifier string for the database.
       */
      constructor(id) {
        this.dynamicProperty = id;
      }
      /**
      * @name size
      * @returns {number} Returns the number of keys in the database.
      */
      get size() {
        const allDynamicPropertyKeys = world.getDynamicPropertyIds().filter((property) => property.startsWith(`${this.dynamicProperty}:`));
        return allDynamicPropertyKeys.length;
      }
      /**
       * @name clear
       * @remarks Clears every keys and its value in the database.
       */
      clear() {
        const allDynamicPropertyKeys = world.getDynamicPropertyIds().filter((property) => property.startsWith(`${this.dynamicProperty}:`));
        for (const key of allDynamicPropertyKeys)
          world.setDynamicProperty(key, void 0);
        this.localState.clear();
      }
      /**
       * @name delete
       * @param {string} key The database key string which needs to be deleted.
       * @remarks Deletes the key from the database.
       */
      delete(key) {
        world.setDynamicProperty(`${this.dynamicProperty}:${key}`, void 0);
        this.localState.delete(key);
      }
      /**
       * @name get
       * @param {string} key The key string of the value to return.
       * @returns {any | object | any[] | undefined} Returns the value string, number, boolean, object, or array associated with the specified key. If no value is associated with the specified key, undefined is returned.
       */
      get(key) {
        if (!this.localState.has(key)) {
          const value = world.getDynamicProperty(`${this.dynamicProperty}:${key}`);
          if (value !== void 0)
            this.setValue(key, value);
          else
            return void 0;
        }
        return this.localState.get(key);
      }
      /**
       * @name has
       * @param {string} key The key string which needs to be check if it exists in the database or not.
       * @returns {boolean} Returns true if the key is found in the database, otherwise returns false.
       */
      has(key) {
        if (this.localState.has(key))
          return true;
        else
          return world.getDynamicProperty(`${this.dynamicProperty}:${key}`) !== void 0;
      }
      /**
       * @name set
       * @param {string} key The key string in which the new value will get set.
       * @param {any | object | any[]} value The value string, number, boolean, object, or array which will be set in the key.
       * @remarks The value provided which will get set in the key provided in the database.
       * @throws Throws RangeError if the string value, or stringify array or object is more than 32767 characters.
       */
      set(key, value) {
        if (this.localState.get(key) === value)
          return;
        if (typeof value === "string" && value.length > 32767)
          throw new RangeError(`Database::set only accepts a string value less than 32767 characters.`);
        if (typeof value !== "object")
          world.setDynamicProperty(`${this.dynamicProperty}:${key}`, value);
        else if (Array.isArray(value)) {
          const arrSignatureId = `papiDatabase:${objArrSignature}`;
          const newValue = [...value, arrSignatureId];
          const stringify = JSON.stringify(newValue);
          if (stringify.length > 32767)
            throw new RangeError(`Database::set only accepts a stringify array value less than ${32767 - (5 + arrSignatureId.length)} characters.`);
          world.setDynamicProperty(`${this.dynamicProperty}:${key}`, stringify);
        } else {
          const newValue = {
            ...value,
            ["papiDatabase"]: objArrSignature
          };
          const stringify = JSON.stringify(newValue);
          if (stringify.length > 32767)
            throw new RangeError(`Database::set only accepts a stringify object value less than ${32767 - (16 + objArrSignature.length)} characters.`);
          world.setDynamicProperty(`${this.dynamicProperty}:${key}`, stringify);
        }
        this.localState.set(key, value);
      }
      /**
       * @name entries
       * @returns {IterableIterator<[string, any | object | any[]]>} Returns an iterable of keys string array, and values string, number, boolean, array, or object array pairs for every keys in the database.
       */
      *entries() {
        const dynamicPropertyId = `${this.dynamicProperty}:`;
        const allDynamicPropertyKeys = world.getDynamicPropertyIds().filter((property) => property.startsWith(dynamicPropertyId));
        for (const key of allDynamicPropertyKeys) {
          const slicedKey = key.slice(dynamicPropertyId.length);
          let value;
          if (this.localState.has(slicedKey))
            value = this.localState.get(slicedKey);
          else {
            value = world.getDynamicProperty(key);
            if (typeof value === "string")
              value = this.parseValue(value);
          }
          yield [slicedKey, value];
        }
      }
      /**
       * @name keys
       * @returns {IterableIterator<string>} Returns an iterable of keys string in the database.
       */
      *keys() {
        const dynamicPropertyId = `${this.dynamicProperty}:`;
        const allDynamicPropertyKeys = world.getDynamicPropertyIds().filter((property) => property.startsWith(dynamicPropertyId));
        for (const key of allDynamicPropertyKeys) {
          const slicedKey = key.slice(dynamicPropertyId.length);
          yield slicedKey;
        }
      }
      /**
       * @name values
       * @returns {IterableIterator<any | object | any[]>} Returns an iterable of values string, number, boolean, object, or array in the database.
       */
      *values() {
        const dynamicPropertyId = `${this.dynamicProperty}:`;
        const allDynamicPropertyKeys = world.getDynamicPropertyIds().filter((property) => property.startsWith(dynamicPropertyId));
        for (const key of allDynamicPropertyKeys) {
          const slicedKey = key.slice(dynamicPropertyId.length);
          let value;
          if (this.localState.has(slicedKey))
            value = this.localState.get(slicedKey);
          else {
            value = world.getDynamicProperty(key);
            if (typeof value === "string")
              value = this.parseValue(value);
          }
          yield value;
        }
      }
    };
  }
});

// src/combatlog/databases.ts
var clSettings, safezones, itemblacklist, bannedplayers;
var init_databases = __esm({
  "src/combatlog/databases.ts"() {
    init_database();
    clSettings = new Database(`clsettings`);
    safezones = new Database(`clsafezones`);
    itemblacklist = new Database(`cliblacklist`);
    bannedplayers = new Database(`bannedplayers`);
  }
});

// src/stuff/config.ts
var config;
var init_config = __esm({
  "src/stuff/config.ts"() {
    config = {
      prefix: "==",
      staffTag: "cl-staff"
    };
  }
});

// src/stuff/commonUtils.ts
import { system, world as world2 } from "@minecraft/server";
function sendPlayerMessage(player, message, removeSpaces = false) {
  const formattedMessage = removeSpaces ? message.replaceAll(/(\r\n|\r|\n)/g, `
`).replaceAll(/  +/g, ``) : message;
  player.sendMessage(formattedMessage);
}
function sendAllMessage(message, removeSpaces = false, requiredTag) {
  const formattedMessage = removeSpaces ? message.replaceAll(/(\r\n|\r|\n)/g, `
`).replaceAll(/  +/g, ``) : message;
  if (!requiredTag) {
    world2.sendMessage(formattedMessage);
  } else {
    for (const player of world2.getAllPlayers()) {
      if (player.hasTag(requiredTag)) {
        player.sendMessage(formattedMessage);
      }
    }
  }
}
function helpMoreInfo(player, args) {
  const cmdData = commands.find((c) => c.name.toLowerCase() === args[0]?.toLowerCase() || c.aliases?.includes(args[0]?.toLowerCase()));
  if (!cmdData)
    return false;
  if ((cmdData.staffOnly || cmdData.altHelpMenu) && !(player.commandPermissionLevel >= 2 || player.hasTag(`lifesteal-opped`))) {
    sendPlayerMessage(player, `\xA7cYou do not have permission to do this!`);
    return true;
  }
  if ((cmdData.staffOnly || cmdData.altHelpMenu) && cmdData.helpMenu && cmdData.helpMenu !== `none`) {
    cmdData.helpMenu = cmdData.helpMenu.replaceAll(`\xA7e`, `\xA79`).replaceAll(`\xA7g`, `\xA7u`);
  }
  if (cmdData.altHelpMenu && !(player.commandPermissionLevel >= 2 || player.hasTag(`lifesteal-opped`))) {
    sendPlayerMessage(player, `${cmdData.altHelpMenu}`);
    return true;
  }
  if (!cmdData.helpMenu) {
    sendPlayerMessage(player, `\xA7cThere is no available help menu, this is a bug and should be reported to GamerDos. Probably forgot to put a help menu because hes stupid lmao (Discord: https://dsc.gg/gamerdos). Anyway heres a placeholder help menu:

Command Name: ${cmdData.name}
Staff Only: ${cmdData.staffOnly}
Command aliases: [
    ${cmdData.aliases?.join(`
    `) ?? `none`}
]`);
    return true;
  }
  if (cmdData.helpMenu === `none`) {
    sendPlayerMessage(player, `\xA7cNo help menu available for this command! (${config.prefix}${args[0]})`);
    return true;
  }
  sendPlayerMessage(player, `${cmdData.helpMenu}`);
  return true;
}
function getScore(player, objective) {
  try {
    return world2.scoreboard.getObjective(objective)?.getScore(player.scoreboardIdentity);
  } catch {
  }
  return void 0;
}
function setScore(player, objective, score) {
  return world2.scoreboard.getObjective(objective).setScore(player, score);
}
function addScore(player, objective, amount) {
  return world2.scoreboard.getObjective(objective).addScore(player.scoreboardIdentity, amount);
}
var timeStamp;
var init_commonUtils = __esm({
  "src/stuff/commonUtils.ts"() {
    init_config();
    init_handler();
    timeStamp = (time) => {
      let seconds = Math.floor(time / 1e3);
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);
      let days = Math.floor(hours / 24);
      const weeks = Math.floor(days / 7);
      seconds %= 60;
      minutes %= 60;
      hours %= 24;
      days %= 7;
      const duration = [];
      if (weeks)
        duration.push(`${weeks} week${weeks > 1 ? `s` : ``}`);
      if (days)
        duration.push(`${days} day${days > 1 ? `s` : ``}`);
      if (hours)
        duration.push(`${hours} hour${hours > 1 ? `s` : ``}`);
      if (minutes)
        duration.push(`${minutes} minute${minutes > 1 ? `s` : ``}`);
      if (seconds)
        duration.push(`${seconds} second${seconds > 1 ? `s` : ``}`);
      if (duration.length)
        return duration.join(`, `);
      else
        return `0 seconds`;
    };
  }
});

// src/stuff/handler.ts
import { system as system2, world as world3 } from "@minecraft/server";
var Command, commands, SlashCommandBuilder;
var init_handler = __esm({
  "src/stuff/handler.ts"() {
    init_commonUtils();
    init_config();
    Command = class _Command {
      static commands = [];
      constructor(commandInfo) {
        if (!_Command.commands.includes(commandInfo))
          _Command.commands.push(commandInfo);
      }
    };
    commands = Command.commands;
    world3.beforeEvents.chatSend.subscribe((data) => {
      if (data.message.startsWith(config.prefix) && data.message !== config.prefix) {
        data.cancel = true;
        const args = data.message.slice(config.prefix.length).match(/[^\s"']+|"[^"]+"|'[^']+'/g).map((x) => x.replace(/"|'/g, ``));
        const command = args.shift();
        const cmdData = commands.find((c) => c.name.toLowerCase() === command.toLowerCase() || c.aliases?.includes(command.toLowerCase()));
        if (!cmdData) {
          sendPlayerMessage(data.sender, `\xA7cUnknown command: "${command}". Do ${config.prefix}help for a list of valid commands.`);
          return;
        }
        if (cmdData.staffOnly && !data.sender.hasTag(config.staffTag) && !(data.sender.playerPermissionLevel === 2))
          return sendPlayerMessage(data.sender, `\xA7cYou do not have permission to run this command!`);
        const player = data.sender;
        if (!cmdData.helpMenu)
          cmdData.helpMenu = `\xA7cThere is no available help menu, this is a bug and should be reported to GamerDos. He probably forgot to put a help menu because hes stupid lmao (Discord: https://dsc.gg/gamerdos). Placeholder help menu:

Command Name: ${cmdData.name}
Staff Only: ${cmdData.staffOnly}
Command aliases: [
    ${cmdData.aliases?.join(`
    `) ?? `none`}
]`;
        system2.run(() => {
          cmdData.callback({ player, args, cmdData });
        });
      }
    });
    SlashCommandBuilder = class _SlashCommandBuilder {
      static commands = [];
      static enums = [];
      static createCommand(commandData) {
        _SlashCommandBuilder.commands.push(commandData);
      }
      static createEnum(name, values) {
        _SlashCommandBuilder.enums.push({
          name,
          values
        });
      }
      static registerCommands(customCommandRegistry) {
        this.registerEnums(customCommandRegistry);
        for (const slashCommand of _SlashCommandBuilder.commands) {
          customCommandRegistry.registerCommand(slashCommand.commandInfo, slashCommand.callback);
        }
      }
      static registerEnums(customCommandRegistry) {
        for (const customEnum of _SlashCommandBuilder.enums) {
          customCommandRegistry.registerEnum(customEnum.name, customEnum.values);
        }
      }
    };
  }
});

// src/combatlog/events/afterEvents/entityDie.ts
var entityDie_exports = {};
import { world as world12, system as system17 } from "@minecraft/server";
var init_entityDie = __esm({
  "src/combatlog/events/afterEvents/entityDie.ts"() {
    world12.afterEvents.entityDie.subscribe((data) => {
      let player = data.deadEntity;
      let damaging = data.damageSource.damagingEntity;
      if (!player || !player.isValid || player.typeId !== `minecraft:player`)
        return;
      if (player.hasTag(`cl-combatlogged`))
        player.runCommand(`title @s actionbar \xA73You are no longer in combat!`);
      player.removeTag(`cl-combatlogged`);
      if (!damaging || damaging.typeId !== `minecraft:player` || player === damaging)
        return;
      system17.runTimeout(() => {
        player.addTag(`cl-spawnkill`);
      }, 5);
    });
  }
});

// node_modules/@minecraft/math/lib/general/clamp.js
function clampNumber(val, min, max) {
  return Math.min(Math.max(val, min), max);
}
var init_clamp = __esm({
  "node_modules/@minecraft/math/lib/general/clamp.js"() {
  }
});

// node_modules/@minecraft/math/lib/vector3/coreHelpers.js
var Vector3Utils;
var init_coreHelpers = __esm({
  "node_modules/@minecraft/math/lib/vector3/coreHelpers.js"() {
    init_clamp();
    Vector3Utils = class _Vector3Utils {
      /**
       * equals
       *
       * Check the equality of two vectors
       */
      static equals(v1, v2) {
        return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
      }
      /**
       * add
       *
       * Add two vectors to produce a new vector
       */
      static add(v1, v2) {
        return { x: v1.x + (v2.x ?? 0), y: v1.y + (v2.y ?? 0), z: v1.z + (v2.z ?? 0) };
      }
      /**
       * subtract
       *
       * Subtract two vectors to produce a new vector (v1-v2)
       */
      static subtract(v1, v2) {
        return { x: v1.x - (v2.x ?? 0), y: v1.y - (v2.y ?? 0), z: v1.z - (v2.z ?? 0) };
      }
      /** scale
       *
       * Multiple all entries in a vector by a single scalar value producing a new vector
       */
      static scale(v1, scale) {
        return { x: v1.x * scale, y: v1.y * scale, z: v1.z * scale };
      }
      /**
       * dot
       *
       * Calculate the dot product of two vectors
       */
      static dot(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
      }
      /**
       * cross
       *
       * Calculate the cross product of two vectors. Returns a new vector.
       */
      static cross(a, b) {
        return { x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x };
      }
      /**
       * magnitude
       *
       * The magnitude of a vector
       */
      static magnitude(v) {
        return Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
      }
      /**
       * distance
       *
       * Calculate the distance between two vectors
       */
      static distance(a, b) {
        return _Vector3Utils.magnitude(_Vector3Utils.subtract(a, b));
      }
      /**
       * normalize
       *
       * Takes a vector 3 and normalizes it to a unit vector
       */
      static normalize(v) {
        const mag = _Vector3Utils.magnitude(v);
        return { x: v.x / mag, y: v.y / mag, z: v.z / mag };
      }
      /**
       * floor
       *
       * Floor the components of a vector to produce a new vector
       */
      static floor(v) {
        return { x: Math.floor(v.x), y: Math.floor(v.y), z: Math.floor(v.z) };
      }
      /**
       * toString
       *
       * Create a string representation of a vector3
       */
      static toString(v, options) {
        const decimals = options?.decimals ?? 2;
        const str = [v.x.toFixed(decimals), v.y.toFixed(decimals), v.z.toFixed(decimals)];
        return str.join(options?.delimiter ?? ", ");
      }
      /**
       * fromString
       *
       * Gets a Vector3 from the string representation produced by {@link Vector3Utils.toString}. If any numeric value is not a number
       * or the format is invalid, undefined is returned.
       * @param str - The string to parse
       * @param delimiter - The delimiter used to separate the components. Defaults to the same as the default for {@link Vector3Utils.toString}
       */
      static fromString(str, delimiter = ",") {
        const parts = str.split(delimiter);
        if (parts.length !== 3) {
          return void 0;
        }
        const output = parts.map((part) => parseFloat(part));
        if (output.some((part) => isNaN(part))) {
          return void 0;
        }
        return { x: output[0], y: output[1], z: output[2] };
      }
      /**
       * clamp
       *
       * Clamps the components of a vector to limits to produce a new vector
       */
      static clamp(v, limits) {
        return {
          x: clampNumber(v.x, limits?.min?.x ?? Number.MIN_SAFE_INTEGER, limits?.max?.x ?? Number.MAX_SAFE_INTEGER),
          y: clampNumber(v.y, limits?.min?.y ?? Number.MIN_SAFE_INTEGER, limits?.max?.y ?? Number.MAX_SAFE_INTEGER),
          z: clampNumber(v.z, limits?.min?.z ?? Number.MIN_SAFE_INTEGER, limits?.max?.z ?? Number.MAX_SAFE_INTEGER)
        };
      }
      /**
       * lerp
       *
       * Constructs a new vector using linear interpolation on each component from two vectors.
       */
      static lerp(a, b, t) {
        return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: a.z + (b.z - a.z) * t };
      }
      /**
       * slerp
       *
       * Constructs a new vector using spherical linear interpolation on each component from two vectors.
       */
      static slerp(a, b, t) {
        const theta = Math.acos(_Vector3Utils.dot(a, b));
        const sinTheta = Math.sin(theta);
        const ta = Math.sin((1 - t) * theta) / sinTheta;
        const tb = Math.sin(t * theta) / sinTheta;
        return _Vector3Utils.add(_Vector3Utils.scale(a, ta), _Vector3Utils.scale(b, tb));
      }
      /**
       * multiply
       *
       * Element-wise multiplication of two vectors together.
       * Not to be confused with {@link Vector3Utils.dot} product or {@link Vector3Utils.cross} product
       */
      static multiply(a, b) {
        return { x: a.x * b.x, y: a.y * b.y, z: a.z * b.z };
      }
      /**
       * rotateX
       *
       * Rotates the vector around the x axis counterclockwise (left hand rule)
       * @param a - Angle in radians
       */
      static rotateX(v, a) {
        let cos = Math.cos(a);
        let sin = Math.sin(a);
        return { x: v.x, y: v.y * cos - v.z * sin, z: v.z * cos + v.y * sin };
      }
      /**
       * rotateY
       *
       * Rotates the vector around the y axis counterclockwise (left hand rule)
       * @param a - Angle in radians
       */
      static rotateY(v, a) {
        let cos = Math.cos(a);
        let sin = Math.sin(a);
        return { x: v.x * cos + v.z * sin, y: v.y, z: v.z * cos - v.x * sin };
      }
      /**
       * rotateZ
       *
       * Rotates the vector around the z axis counterclockwise (left hand rule)
       * @param a - Angle in radians
       */
      static rotateZ(v, a) {
        let cos = Math.cos(a);
        let sin = Math.sin(a);
        return { x: v.x * cos - v.y * sin, y: v.y * cos + v.x * sin, z: v.z };
      }
    };
  }
});

// node_modules/@minecraft/math/lib/vector3/vectorWrapper.js
var Vector3Builder;
var init_vectorWrapper = __esm({
  "node_modules/@minecraft/math/lib/vector3/vectorWrapper.js"() {
    init_coreHelpers();
    Vector3Builder = class {
      x;
      y;
      z;
      constructor(first, second, z) {
        if (typeof first === "object") {
          this.x = first.x;
          this.y = first.y;
          this.z = first.z;
        } else if (typeof first === "string") {
          const parsed = Vector3Utils.fromString(first, second ?? ",");
          if (!parsed) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            return;
          }
          this.x = parsed.x;
          this.y = parsed.y;
          this.z = parsed.z;
        } else {
          this.x = first;
          this.y = second ?? 0;
          this.z = z ?? 0;
        }
      }
      /**
       * Assigns the values of the passed in vector to this vector. Returns itself.
       */
      assign(vec) {
        this.x = vec.x;
        this.y = vec.y;
        this.z = vec.z;
        return this;
      }
      /**
       * equals
       *
       * Check the equality of two vectors
       */
      equals(v) {
        return Vector3Utils.equals(this, v);
      }
      /**
       * add
       *
       * Adds the vector v to this, returning itself.
       */
      add(v) {
        return this.assign(Vector3Utils.add(this, v));
      }
      /**
       * subtract
       *
       * Subtracts the vector v from this, returning itself.
       */
      subtract(v) {
        return this.assign(Vector3Utils.subtract(this, v));
      }
      /** scale
       *
       * Scales this by the passed in value, returning itself.
       */
      scale(val) {
        return this.assign(Vector3Utils.scale(this, val));
      }
      /**
       * dot
       *
       * Computes the dot product of this and the passed in vector.
       */
      dot(vec) {
        return Vector3Utils.dot(this, vec);
      }
      /**
       * cross
       *
       * Computes the cross product of this and the passed in vector, returning itself.
       */
      cross(vec) {
        return this.assign(Vector3Utils.cross(this, vec));
      }
      /**
       * magnitude
       *
       * The magnitude of the vector
       */
      magnitude() {
        return Vector3Utils.magnitude(this);
      }
      /**
       * distance
       *
       * Calculate the distance between two vectors
       */
      distance(vec) {
        return Vector3Utils.distance(this, vec);
      }
      /**
       * normalize
       *
       * Normalizes this vector, returning itself.
       */
      normalize() {
        return this.assign(Vector3Utils.normalize(this));
      }
      /**
       * floor
       *
       * Floor the components of a vector to produce a new vector
       */
      floor() {
        return this.assign(Vector3Utils.floor(this));
      }
      /**
       * toString
       *
       * Create a string representation of a vector
       */
      toString(options) {
        return Vector3Utils.toString(this, options);
      }
      /**
       * clamp
       *
       * Clamps the components of a vector to limits to produce a new vector
       */
      clamp(limits) {
        return this.assign(Vector3Utils.clamp(this, limits));
      }
      /**
       * lerp
       *
       * Constructs a new vector using linear interpolation on each component from two vectors.
       */
      lerp(vec, t) {
        return this.assign(Vector3Utils.lerp(this, vec, t));
      }
      /**
       * slerp
       *
       * Constructs a new vector using spherical linear interpolation on each component from two vectors.
       */
      slerp(vec, t) {
        return this.assign(Vector3Utils.slerp(this, vec, t));
      }
      /**
       * multiply
       *
       * Element-wise multiplication of two vectors together.
       * Not to be confused with {@link Vector3Builder.dot} product or {@link Vector3Builder.cross} product
       */
      multiply(vec) {
        return this.assign(Vector3Utils.multiply(this, vec));
      }
      /**
       * rotateX
       *
       * Rotates the vector around the x axis counterclockwise (left hand rule)
       * @param a - Angle in radians
       */
      rotateX(a) {
        return this.assign(Vector3Utils.rotateX(this, a));
      }
      /**
       * rotateY
       *
       * Rotates the vector around the y axis counterclockwise (left hand rule)
       * @param a - Angle in radians
       */
      rotateY(a) {
        return this.assign(Vector3Utils.rotateY(this, a));
      }
      /**
       * rotateZ
       *
       * Rotates the vector around the z axis counterclockwise (left hand rule)
       * @param a - Angle in radians
       */
      rotateZ(a) {
        return this.assign(Vector3Utils.rotateZ(this, a));
      }
    };
  }
});

// node_modules/@minecraft/math/lib/vector3/index.js
var init_vector3 = __esm({
  "node_modules/@minecraft/math/lib/vector3/index.js"() {
    init_coreHelpers();
    init_vectorWrapper();
  }
});

// node_modules/@minecraft/math/lib/general/index.js
var init_general = __esm({
  "node_modules/@minecraft/math/lib/general/index.js"() {
    init_clamp();
  }
});

// node_modules/@minecraft/math/lib/index.js
var init_lib = __esm({
  "node_modules/@minecraft/math/lib/index.js"() {
    init_vector3();
    init_general();
  }
});

// src/combatlog/safezone.ts
import { BlockVolume, MolangVariableMap, system as system18 } from "@minecraft/server";
function safezoneGetData(safezone) {
  const coords = safezone[0].split(`--`);
  const min = new Vector3Builder(+coords[0], +coords[1], +coords[2]);
  const max = new Vector3Builder(+coords[3], +coords[4], +coords[5]);
  const isPvpSafezone = safezone[1] === `both` || safezone[1] === `false`;
  const isBlockSafezone = safezone[1] === `both` || safezone[1] === `true`;
  return { min, max, isPvpSafezone, isBlockSafezone };
}
function* drawEdgeGenerator(player, start, end, pvpSafezone, blockSafezone) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dz = end.z - start.z;
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const steps = Math.ceil(length / 0.5);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = start.x + dx * t + 0.5;
    const y = start.y + dy * t + 0.5;
    const z = start.z + dz * t + 0.5;
    if (isNaN(x) || isNaN(y) || isNaN(z) || !player.dimension.getBlock({ x, y, z })?.isValid || Vector3Utils.distance({ x, y, z }, player.location) > 30)
      continue;
    const particleSettings = new MolangVariableMap();
    const redIncrement = pvpSafezone ? 1 : 0;
    const blueIncrement = blockSafezone ? 1 : 0;
    particleSettings.setColorRGBA(`variable.color`, { red: redIncrement, blue: blueIncrement, green: 0, alpha: 1 });
    player.spawnParticle(`minecraft:sparkler_emitter`, { x, y, z }, particleSettings);
    yield;
  }
}
function* safezoneBorderGenerator(player) {
  const insideSafezones = [];
  for (const safezone of safezones.entries()) {
    const { min, max, isBlockSafezone, isPvpSafezone } = safezoneGetData(safezone);
    const boundingBox = new BlockVolume(min, max);
    if (boundingBox.isInside(player.location))
      insideSafezones.push(`${Object.values(min).join(` `)} ${Object.values(max).join(` `)} | ${isBlockSafezone && isPvpSafezone ? `PVP and BlockProtection` : isBlockSafezone ? `BlockProtection` : `PVP`}`);
    const corners = [
      { x: min.x, y: min.y, z: min.z },
      { x: max.x, y: min.y, z: min.z },
      { x: max.x, y: max.y, z: min.z },
      { x: min.x, y: max.y, z: min.z },
      { x: min.x, y: min.y, z: max.z },
      { x: max.x, y: min.y, z: max.z },
      { x: max.x, y: max.y, z: max.z },
      { x: min.x, y: max.y, z: max.z }
    ];
    const edges = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 4],
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7]
    ];
    for (const [a, b] of edges) {
      system18.runJob(drawEdgeGenerator(player, corners[a], corners[b], isPvpSafezone, isBlockSafezone));
      yield;
    }
    yield;
  }
  if (insideSafezones.length)
    player.onScreenDisplay.setActionBar(`\xA76Safezones you're currently in:

\xA7g${insideSafezones.join(`
`)}`);
  else
    player.onScreenDisplay.setActionBar(`\xA7cRed outline \xA76- PVP Safezone
\xA7bBlue outline \xA76- Block Safezone
\xA7dPurple outline \xA76- Both`);
}
var init_safezone = __esm({
  "src/combatlog/safezone.ts"() {
    init_lib();
    init_databases();
  }
});

// src/combatlog/events/beforeEvents/entityHurt.ts
var entityHurt_exports = {};
import { BlockVolume as BlockVolume2, world as world13 } from "@minecraft/server";
function handlePVPSafezones(hurtEntity) {
  for (const safezone of safezones.entries()) {
    const { min, max, isPvpSafezone } = safezoneGetData(safezone);
    const boundingBox = new BlockVolume2(min, max);
    if (boundingBox.isInside(hurtEntity.location) && isPvpSafezone && !hurtEntity.hasTag(`cl-staff`)) {
      return true;
    }
  }
  return false;
}
var init_entityHurt = __esm({
  "src/combatlog/events/beforeEvents/entityHurt.ts"() {
    init_commonUtils();
    init_databases();
    init_safezone();
    world13.beforeEvents.entityHurt.subscribe((data) => {
      const player = data.hurtEntity;
      const damaging = data.damageSource.damagingEntity;
      if (!damaging || player === damaging)
        return;
      if (player.hasTag(`cl-spawnkill`)) {
        data.cancel = true;
        sendPlayerMessage(damaging, `\xA7cYou cannot damage a player with spawn protection!`);
        return;
      }
      if (handlePVPSafezones(player)) {
        data.cancel = true;
        sendPlayerMessage(damaging, `\xA7cYou cannot damage a player who's inside a safezone!`);
        return;
      }
    }, { entityFilter: { type: `minecraft:player` } });
  }
});

// src/combatlog/events/afterEvents/entityHurt.ts
var entityHurt_exports2 = {};
import { world as world14 } from "@minecraft/server";
function handleCombat(hurtEntity, damagingEntity) {
  const combatscore = +clSettings.get(`combattime`);
  const message = `\xA78[\xA76!\xA78] \xA74You are now combat logged! \xA76Do not leave or you will die \xA7l(\xA73${timeStamp(combatscore * 1e3)} left\xA76)`;
  if (hurtEntity.typeId === `minecraft:player`) {
    if (!hurtEntity.hasTag(`cl-combatlogged`))
      sendPlayerMessage(hurtEntity, message);
    hurtEntity.addTag(`cl-combatlogged`);
    hurtEntity.runCommand(`scoreboard players set @s combatlog ${clSettings.get(`combattime`) * 20}`);
  }
  if (damagingEntity.typeId === `minecraft:player`) {
    if (!damagingEntity.hasTag(`cl-combatlogged`))
      sendPlayerMessage(damagingEntity, message);
    damagingEntity.addTag(`cl-combatlogged`);
    damagingEntity.runCommand(`scoreboard players set @s combatlog ${clSettings.get(`combattime`) * 20}`);
  }
}
function oneIsMonster(entity, damagingEntity) {
  const entityFamilies = entity.getComponent(`type_family`);
  const damagingEntityFamilies = damagingEntity.getComponent(`type_family`);
  const triggers = [`monster`];
  return !(entityFamilies.getTypeFamilies().some((family) => triggers.includes(family)) !== damagingEntityFamilies.getTypeFamilies().some((family) => triggers.includes(family)));
}
var init_entityHurt2 = __esm({
  "src/combatlog/events/afterEvents/entityHurt.ts"() {
    init_databases();
    init_commonUtils();
    world14.afterEvents.entityHurt.subscribe((data) => {
      const player = data.hurtEntity;
      const damaging = data.damageSource.damagingEntity;
      if (!damaging || player === damaging)
        return;
      if (damaging.hasTag(`cl-spawnkill`)) {
        player.runCommand(`title @s actionbar \xA7cYou no longer have spawn protection!`);
        player.removeTag(`cl-spawnkill`);
      }
      if (clSettings.get(`disablepunish`) === `true`)
        return;
      if (clSettings.get(`mobtriggerlog`) === `false` && (player.typeId !== `minecraft:player` || damaging.typeId !== `minecraft:player`))
        return;
      if (clSettings.get(`mobtriggerlog`) === `true` && oneIsMonster(player, damaging))
        return;
      handleCombat(player, damaging);
    });
  }
});

// src/combatlog/events/beforeEvents/itemUse.ts
var itemUse_exports = {};
import { world as world15 } from "@minecraft/server";
var init_itemUse = __esm({
  "src/combatlog/events/beforeEvents/itemUse.ts"() {
    init_databases();
    init_commonUtils();
    world15.beforeEvents.itemUse.subscribe((data) => {
      const player = data.source;
      const item = data.itemStack;
      if (player.typeId !== `minecraft:player`)
        return;
      if (item.typeId === `minecraft:ender_pearl` && player.hasTag(`cl-combatlogged`)) {
        if (clSettings.get(`disabletpcombat`) !== `true`)
          return;
        data.cancel = true;
        sendPlayerMessage(player, `\xA74You cannot teleport in combat!`);
      }
      if (item.typeId.includes(`potion`) && player.hasTag(`cl-combatlogged`)) {
        if (clSettings.get(`potionsincombat`) === `false`) {
          data.cancel = true;
          sendPlayerMessage(player, `\xA74You cannot use potions in combat!`);
        }
      }
    });
  }
});

// src/combatlog/events/beforeEvents/playerBreakBlock.ts
var playerBreakBlock_exports = {};
import { BlockVolume as BlockVolume4, world as world16 } from "@minecraft/server";
var init_playerBreakBlock = __esm({
  "src/combatlog/events/beforeEvents/playerBreakBlock.ts"() {
    init_databases();
    init_commonUtils();
    init_safezone();
    world16.beforeEvents.playerBreakBlock.subscribe((data) => {
      for (const safezone of safezones.entries()) {
        const { min, max, isBlockSafezone } = safezoneGetData(safezone);
        const location = data.block.location;
        const boundingBox = new BlockVolume4(min, max);
        const player = data.player;
        if (boundingBox.isInside(location) && isBlockSafezone && !player.hasTag(`cl-staff`) && player.commandPermissionLevel < 2) {
          data.cancel = true;
          sendPlayerMessage(player, `\xA7cSorry\xA77, but you can't break that block here.`);
          return;
        }
      }
    });
  }
});

// src/combatlog/events/beforeEvents/playerInteractBlock.ts
var playerInteractBlock_exports = {};
import { world as world17 } from "@minecraft/server";
var init_playerInteractBlock = __esm({
  "src/combatlog/events/beforeEvents/playerInteractBlock.ts"() {
    init_databases();
    init_commonUtils();
    world17.beforeEvents.playerInteractWithBlock.subscribe((data) => {
      const { player, block, blockFace, itemStack } = data;
      const inventory = player.getComponent(`inventory`).container;
      const mainItem = inventory.getItem(player.selectedSlotIndex);
      if (clSettings.get(`crystalpvp`) !== `false` || !player.hasTag(`cl-combatlogged`))
        return;
      if (block.typeId === `minecraft:respawn_anchor` && player.dimension.id !== `minecraft:nether` || block.typeId === `minecraft:obsidian` && mainItem.typeId === `minecraft:end_crystal`) {
        data.cancel = true;
        sendPlayerMessage(player, `\xA77[\xA76!\xA77]\xA7c Crystal PVP is disabled.`);
      }
    });
  }
});

// src/combatlog/events/beforeEvents/playerLeave.ts
var playerLeave_exports = {};
import { world as world18, EquipmentSlot, system as system21 } from "@minecraft/server";
var init_playerLeave = __esm({
  "src/combatlog/events/beforeEvents/playerLeave.ts"() {
    init_databases();
    world18.beforeEvents.playerLeave.subscribe((data) => {
      const player = data.player;
      const inventory = player.getComponent(`inventory`).container;
      const equippable = player.getComponent(`equippable`);
      const dimension = player.dimension.id;
      const location = player.location;
      const logged = player.hasTag(`cl-combatlogged`);
      const playerLevel = player.level;
      const playerData = [];
      const equipmentSlots = [
        EquipmentSlot.Head,
        EquipmentSlot.Chest,
        EquipmentSlot.Legs,
        EquipmentSlot.Feet,
        EquipmentSlot.Offhand
      ];
      for (let i = 0; i < inventory.size; i++) {
        const item = inventory.getItem(i);
        if (item)
          playerData.push(item);
      }
      for (const slot of equipmentSlots) {
        const item = equippable.getEquipment(slot);
        if (item)
          playerData.push(item);
      }
      if (+clSettings.get(`bantime`) !== 0) {
        bannedplayers.set(`${player.id}`, `${Date.now() + +clSettings.get(`bantime`) * 1e3}`);
      }
      system21.run(() => {
        if (!playerData || logged === false || clSettings.get(`itemdroplog`) === `false` || clSettings.get(`disablepunish`) === `true`)
          return;
        for (const item of playerData) {
          world18.getDimension(dimension).spawnItem(item, location);
        }
        if (playerLevel > 0) {
          for (let i = 0; i < 7 * playerLevel && i < 100; i++) {
            world18.getDimension(dimension).spawnEntity("minecraft:xp_orb", location);
          }
        }
      });
    });
  }
});

// src/combatlog/events/beforeEvents/playerPlaceBlock.ts
var playerPlaceBlock_exports = {};
import { BlockVolume as BlockVolume5, world as world19 } from "@minecraft/server";
function getOffsetFromDirection(facingDirection) {
  let facingDir = facingDirection.toLowerCase();
  if (facingDir === `up`)
    facingDir = `above`;
  if (facingDir === `down`)
    facingDir = `below`;
  return directions.find((x) => x.toLowerCase() === facingDir);
}
var directions;
var init_playerPlaceBlock = __esm({
  "src/combatlog/events/beforeEvents/playerPlaceBlock.ts"() {
    init_databases();
    init_commonUtils();
    init_safezone();
    world19.beforeEvents.playerPlaceBlock.subscribe((data) => {
      for (const safezone of safezones.entries()) {
        const { min, max, isBlockSafezone } = safezoneGetData(safezone);
        const boundingBox = new BlockVolume5(min, max);
        const location = data.block[getOffsetFromDirection(data.face.toLowerCase())]();
        const player = data.player;
        if (boundingBox.isInside(location) && isBlockSafezone && !player.hasTag(`cl-staff`) && player.commandPermissionLevel < 2) {
          data.cancel = true;
          sendPlayerMessage(player, `\xA7cSorry\xA77, but you can't place that block here.`);
          return;
        }
      }
    });
    directions = [`west`, `east`, `below`, `above`, `north`, `south`];
  }
});

// src/combatlog/events/afterEvents/playerSpawn.ts
var playerSpawn_exports = {};
import { world as world20, GameMode, system as system22, EquipmentSlot as EquipmentSlot2 } from "@minecraft/server";
var init_playerSpawn = __esm({
  "src/combatlog/events/afterEvents/playerSpawn.ts"() {
    init_databases();
    init_commonUtils();
    init_config();
    world20.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
      if (initialSpawn === false)
        return;
      if (player.hasTag(`cl-combatlogged`)) {
        player.removeTag(`cl-combatlogged`);
        player.setGameMode(GameMode.Survival);
        if (world20.getDynamicProperty(`lifesteal:envsteal`) === false) {
          addScore(player, `ls-death`, world20.getDynamicProperty(`lifesteal:heartlose`));
        }
        if (clSettings.get(`itemdroplog`) === `true`) {
          player.resetLevel();
          player.getComponent(`inventory`).container.clearAll();
          const equippable = player.getComponent(`equippable`);
          for (const equipment of Object.values(EquipmentSlot2)) {
            equippable.setEquipment(equipment);
          }
          player.kill();
          sendAllMessage(`\xA7c${+clSettings.get(`bantime`) !== 0 ? `Banned` : `Killed`} ${player.name} for \xA76Combat Logging`);
        } else {
          player.kill();
          sendAllMessage(`\xA7c${+clSettings.get(`bantime`) !== 0 ? `Banned` : `Killed`} ${player.name} for \xA76Combat Logging (turn off keepinventory if items didn't drop)`);
        }
        system22.run(() => {
          if (+clSettings.get(`bantime`) !== 0) {
            if (!bannedplayers.get(`${player.id}`))
              bannedplayers.set(`${player.id}`, `${Date.now() + +clSettings.get(`bantime`) * 1e3}`);
            const endTime = bannedplayers.get(`${player.id}`);
            const currentTime = Date.now();
            if (currentTime < endTime) {
              player.runCommand(`kick ${player.name} \xA7cYou combat logged!

\xA7cYou will be unbanned in \xA76${timeStamp(endTime - currentTime)}`);
              sendPlayerMessage(player, `\xA7cYou combat logged!

\xA7cYou will be unbanned in \xA76${timeStamp(endTime - currentTime)}`);
            }
          }
        });
      }
      sendPlayerMessage(player, `\xA74-----
\xA7cThis world/realm/server is protected by Anti Combat Log by \xA7lGamerDos\xA7r
\xA76AntiCL version: 1.6.4
Command Prefix: \xA7l${config.prefix}\xA7r
\xA7dSupport the addon creator! https://patreon.com/gamerdos
\xA71Need help setting up the addon? https://dsc.gg/gamerdos
\xA74-----`);
    });
  }
});

// src/combatlog/system/runInterval.ts
var runInterval_exports = {};
import { system as system23, world as world21, GameMode as GameMode2 } from "@minecraft/server";
function savePlayerData(player) {
  const { name: playerName, location, dimension } = player;
  const logged = player.getTags().includes(`cl-combatlogged`);
  const obj = { playerName, location, dimension: dimension.id, logged, player };
  plrDataMap.set(player.name, obj);
}
function handlePlayerData(player) {
  const inventory = player.getComponent(`inventory`).container;
  const plrData = plrDataMap.get(player.name);
  if (!plrData) {
    savePlayerData(player);
    return;
  }
  if (plrData.logged && clSettings.get(`disabletpcombat`) === `true`) {
    if (Vector3Utils.distance(plrData.location, player.location) > 20) {
      player.teleport(plrData.location, { dimension: player.dimension });
      sendPlayerMessage(player, `\xA74You are in combat and have been teleported back!`);
    }
  }
  for (let i = 0; i < inventory.size; i++) {
    const item = inventory.getItem(i);
    if (item && Array.from(itemblacklist.keys()).includes(item.typeId.replace(/^(.*?:)/, ``)) && !player.hasTag(config.staffTag)) {
      inventory.setItem(i);
      sendPlayerMessage(player, `\xA7c${item.typeId} is blacklisted`);
    }
  }
  savePlayerData(player);
}
function handleDisplay(player) {
  const spActionbar = clSettings.get(`showspawnkillactionbar`) === `true`;
  const combatActionbar = clSettings.get(`showcombatactionbar`) === `true`;
  const combatMessage = clSettings.get(`showcombatmessage`) === `true`;
  if (!player.hasTag(`cl-combatlogged`))
    setScore(player, `combatlog`, clSettings.get(`combattime`) * 20);
  else {
    const combatScore = getScore(player, `combatlog`);
    addScore(player, `combatlog`, -1);
    if (combatActionbar)
      player.onScreenDisplay.setActionBar(`\xA7eYou are \xA7ccombat logged! \xA7l\xA73(\xA7p${timeStamp(combatScore * 50)}\xA73)`);
    if (combatMessage && combatScore % +clSettings.get(`combatmessageinterval`) === 0)
      sendPlayerMessage(player, `\xA7nYou are still in combat! \xA7l\xA73(\xA7p${timeStamp(combatScore * 50)}\xA73)`);
  }
  if (!player.hasTag(`cl-spawnkill`))
    setScore(player, `spawnkill`, clSettings.get(`spawnkilltime`) * 20);
  else {
    player.removeTag(`cl-combatlogged`);
    const spawnkillScore = getScore(player, `spawnkill`);
    addScore(player, `spawnkill`, -1);
    if (spActionbar)
      player.onScreenDisplay.setActionBar(`\xA7eYou are \xA7cspawn protected! \xA7l\xA73(\xA7p${timeStamp(spawnkillScore * 50)}\xA73)`);
  }
  if (getScore(player, `spawnkill`) <= 0 && player.hasTag(`cl-spawnkill`)) {
    player.removeTag(`cl-spawnkill`);
    player.onScreenDisplay.setActionBar(`\xA73You are no longer spawn protected!`);
    sendPlayerMessage(player, `\xA73You are no longer spawn protected!`);
  }
  if (getScore(player, `combatlog`) <= 0 && player.hasTag(`cl-combatlogged`)) {
    player.removeTag(`cl-combatlogged`);
    player.onScreenDisplay.setActionBar(`\xA73You are no longer in combat!`);
    sendPlayerMessage(player, `\xA73You are no longer in combat!`);
  }
}
function stopGliding(player) {
  const gamemode = player.getGameMode();
  player.setGameMode(GameMode2.Spectator);
  player.setGameMode(gamemode);
  sendPlayerMessage(player, `\xA74You are in combat and you cannot use your elytra!`);
}
var plrDataMap;
var init_runInterval = __esm({
  "src/combatlog/system/runInterval.ts"() {
    init_lib();
    init_databases();
    init_commonUtils();
    init_config();
    init_safezone();
    plrDataMap = /* @__PURE__ */ new Map();
    system23.runInterval(() => {
      for (const player of world21.getAllPlayers()) {
        if (system23.currentTick % 20 === 0 && player.hasTag(`cl-showsafezones`)) {
          system23.runJob(safezoneBorderGenerator(player));
        }
        if (system23.currentTick % 4 === 0) {
          handlePlayerData(player);
        }
        if (player.hasTag(`cl-combatlogged`) && clSettings.get(`disableelytracombat`) === `true` && player.isGliding) {
          stopGliding(player);
        }
        handleDisplay(player);
      }
    }, 1);
  }
});

// src/main.ts
init_databases();
import { world as world22 } from "@minecraft/server";

// src/combatlog/commands/check.ts
init_handler();
init_config();
init_commonUtils();
import { Player as Player3, system as system3, CustomCommandStatus } from "@minecraft/server";
SlashCommandBuilder.createCommand({
  commandInfo: {
    name: `acl:check`,
    description: `Checks if you are combat tagged.`,
    permissionLevel: 0
  },
  callback(origin) {
    const player = origin.sourceEntity;
    if (!(player instanceof Player3))
      return { status: CustomCommandStatus.Failure, message: `Not a player` };
    system3.run(() => {
      const combatscore = getScore(player, `combatlog`);
      const inCombat = player.hasTag(`cl-combatlogged`);
      sendPlayerMessage(player, `\xA76You are \xA74${!inCombat ? `not in combat` : `in combat for ${timeStamp(combatscore * 50)}`}`);
    });
    return { status: CustomCommandStatus.Success };
  }
});
new Command({
  name: `check`,
  helpMenu: `\xA7e\xA7lAntiCL Help Page -- check\xA7r\xA7g
> Check if you are combat tagged

> Usage: ${config.prefix}check

> Examples: [
    ${config.prefix}check
]`,
  callback({ player, args }) {
    const combatscore = getScore(player, `combatlog`);
    const inCombat = player.hasTag(`cl-combatlogged`);
    sendPlayerMessage(player, `\xA76You are \xA74${!inCombat ? `not in combat` : `in combat for ${timeStamp(combatscore * 50)}`}`);
  }
});

// src/combatlog/commands/help.ts
init_handler();
init_config();
init_commonUtils();
new Command({
  name: `help`,
  aliases: [`h`],
  helpMenu: `none`,
  callback({ player, args }) {
    if (helpMoreInfo(player, args) === true)
      return;
    const cmdData = commands.find((c) => c.name.toLowerCase() === args[0]?.toLowerCase() || c.aliases?.includes(args[0]?.toLowerCase()));
    if (cmdData) {
      if (cmdData.altHelpMenu && !(player.commandPermissionLevel >= 2 || player.hasTag(`lifesteal-opped`))) {
        sendPlayerMessage(player, `${cmdData.altHelpMenu}`);
        return;
      }
      if (!cmdData.helpMenu)
        return sendPlayerMessage(player, `\xA7cThere is no available help menu, this is a bug and should be reported to GamerDos. Probably forgot to put a help menu because hes stupid lmao (Discord: https://dsc.gg/gamerdos). Anyway heres a placeholder help menu:

Command Name: ${cmdData.name}
Staff Only: ${cmdData.staffOnly}
Command aliases: [
    ${cmdData.aliases?.join(`
    `) ?? `none`}
]`);
      if (cmdData.helpMenu === `none`) {
        sendPlayerMessage(player, `\xA7cNo help menu available for this command! (${config.prefix}${args[0]})`);
        return;
      }
      sendPlayerMessage(player, `${cmdData.helpMenu}`);
      return;
    }
    sendPlayerMessage(
      player,
      `\xA7c----------------------------
\xA7c\xA7lACL Help Page\xA7r
\xA7f\xA7lCommand Prefix: \xA7c${config.prefix}
\xA7r\xA7c----------------------------

\xA76Normie Commands --

\xA7e- \xA7lrelievesp \xA7r\xA7g| Removes your spawn protection if you have just been killed by a player
\xA7e- \xA7lcheck \xA7r\xA7g| Check if you are combat logged

\xA7r\xA7sStaff Commands --\xA7r
${player.hasTag(config.staffTag) || player.commandPermissionLevel >= 2 ? `
\xA79- \xA7lcombattime <amount> \xA7r\xA7u| Set the combat time
\xA79- \xA7lmobtriggerlog <true/false> \xA7r\xA7u| Whether or not mobs combat tag you
\xA79- \xA7lspawnkilltime <amount/disable> \xA7r\xA7u| Set the spawn kill time
\xA79- \xA7ldisabletpcombat <true/false> \xA7r\xA7u| Whether or not to disable ender pearls in combat
\xA79- \xA7litemdroplog <true/false> \xA7r\xA7u| Toggle whether items drop immediately after a combat tagged player leaves, or after they join back
\xA79- \xA7ldisableelytracombat <true/false> \xA7r\xA7u| Toggle whether elytras are allowed in combat or not
\xA79- \xA7lcrystalpvp <true/false> \xA7r\xA7u| Toggle whether or not Crystal PVP (End crystals and Respawn Anchors) is allowed in combat
\xA79- \xA7lpotsincombat <true/false> \xA7r\xA7u| Toggle whether or not potions are allowed to be used in combat
\xA79- \xA7lsafezone <add/remove/list> <coord1> <coord2> \xA7r\xA7u| Add, remove, or list safezones
\xA79- \xA7litemblacklist <itemid> \xA7r\xA7u| Add an item to the item black list
\xA79- \xA7lbantime <amount> \xA7r\xA7u| Set the amount of time a player gets banned for for combat logging
\xA79- \xA7ldisplay <combatmessage/combatactionbar/spactionbar> \xA7r\xA7u| Display settings

\xA7r\xA7f\xA7lDo ${config.prefix}help <commandName> for information on that command!` : `\xA7cYou do not have permission to see this! Do /tag @s add ${config.staffTag} to get permission

\xA7r\xA7f\xA7lDo ${config.prefix}help <commandName> for information on that command!`}`
    );
  }
});

// src/combatlog/commands/rsp.ts
init_handler();
init_config();
init_commonUtils();
import { Player as Player4, system as system4, CustomCommandStatus as CustomCommandStatus2 } from "@minecraft/server";
SlashCommandBuilder.createCommand({
  commandInfo: {
    name: `acl:relievesp`,
    description: `Removes spawn protection if you have it.`,
    permissionLevel: 0
  },
  callback(origin) {
    const player = origin.sourceEntity;
    if (!(player instanceof Player4))
      return { status: CustomCommandStatus2.Failure, message: `Not a player` };
    if (!player.hasTag(`cl-spawnkill`))
      return { status: CustomCommandStatus2.Failure, message: `You don't have spawn protection!` };
    system4.run(() => {
      player.removeTag(`cl-spawnkill`);
      player.onScreenDisplay.setActionBar(`\xA73You are no longer spawn protected!`);
    });
    return { status: CustomCommandStatus2.Success, message: `\xA7cYou no longer have spawn protection!` };
  }
});
new Command({
  name: `relievesp`,
  aliases: [`rsp`, `relievespawnprotection`, `relievespawnprot`, `rsprot`],
  helpMenu: `\xA7e\xA7lAntiCL Help Page -- relievesp\xA7r\xA7g
> Removes spawn protection if you have it

> Usage: ${config.prefix}relievesp

> Aliases: [
    ${config.prefix}rsp
    ${config.prefix}relievespawnprotection
    ${config.prefix}relievespawnprot
    ${config.prefix}rsprot
]

> Examples: [
    ${config.prefix}rsp
    ${config.prefix}relievesp
]`,
  callback({ player, args }) {
    if (!player.hasTag(`cl-spawnkill`))
      return sendPlayerMessage(player, `\xA7cYou don't have spawn protection!`);
    player.removeTag(`cl-spawnkill`);
    sendPlayerMessage(player, `\xA7cYou no longer have spawn protection!`);
    player.onScreenDisplay.setActionBar(`\xA73You are no longer spawn protected!`);
  }
});

// src/combatlog/commands/debug/combatTag.ts
init_handler();
import { CustomCommandParamType as CustomCommandParamType2, CustomCommandStatus as CustomCommandStatus3, Player as Player5, system as system5 } from "@minecraft/server";
SlashCommandBuilder.createEnum(`acl:tag`, [`cl-combatlogged`, `cl-spawnkill`, `cl-showsafezones`]);
SlashCommandBuilder.createEnum(`acl:tagOperation`, [`add`, `remove`]);
SlashCommandBuilder.createCommand({
  commandInfo: {
    name: `acl:addtag`,
    description: `[DEBUG COMMAND] Adds combat or spawnkill tag`,
    permissionLevel: 1,
    mandatoryParameters: [{ name: `acl:tagOperation`, type: CustomCommandParamType2.Enum }, { name: `acl:tag`, type: CustomCommandParamType2.Enum }]
  },
  callback(origin, tagOperation, tag) {
    const player = origin.sourceEntity;
    if (!(player instanceof Player5))
      return { status: CustomCommandStatus3.Failure, message: `Not a player` };
    system5.run(() => tagOperation === `add` ? player.addTag(tag) : player.removeTag(tag));
    if (tagOperation === `add` && player.hasTag(tag))
      return { status: CustomCommandStatus3.Failure, message: `Already have tag` };
    if (tagOperation === `remove` && !player.hasTag(tag))
      return { status: CustomCommandStatus3.Failure, message: `Don't have tag` };
    return { status: CustomCommandStatus3.Success, message: `${tagOperation === `add` ? `added` : `removed`} ${tag}` };
  }
});

// src/combatlog/commands/staffOnly/combatdisplay.ts
init_databases();
init_commonUtils();
init_config();
init_handler();
new Command({
  name: `display`,
  staffOnly: true,
  helpMenu: `\xA7e\xA7lAntiCL Help Page -- display\xA7r\xA7g
> Display settings

> Subcommands: [
    combatmessage <interval <number>/show/hide> - Toggles a message that sends on an interval that displays how much time you're in combat for
    combatactionbar <show/hide> - Toggles the bar that displays how much time you're in combat for
    spactionbar - Toggles the bar that displays how much time you're protected for
    spawnkillactionbar - Same as above
]

> Examples: [
    ${config.prefix}display combatmessage show
    ${config.prefix}display combatmessage hide
    ${config.prefix}display combatmessage interval 3
    ${config.prefix}display combatmessage interval 5
    ${config.prefix}display combatactionbar hide
    ${config.prefix}display spawnkillactionbar show
    ${config.prefix}display spactionbar hide
]`,
  callback({ player, args }) {
    const combatMessage = clSettings.get(`showcombatmessage`);
    const combatMessageInterval = clSettings.get(`combatmessageinterval`);
    const combatActionbar = clSettings.get(`showcombatactionbar`);
    const spActionbar = clSettings.get(`showspawnkillactionbar`);
    if (!args[0])
      return sendPlayerMessage(player, `\xA7qCombat Message\xA7a is set to \xA72${combatMessage ? `show` : `hidden`}\xA7a, 
\xA7qCombat Message Interval\xA7a is set to \xA72${+combatMessageInterval / 20}\xA7a, 
\xA7qCombat Actionbar\xA7a is set to \xA72${combatActionbar ? `show` : `hidden`}\xA7a, 
\xA7qSpawnkill Actionbar\xA7a is set to \xA72${spActionbar ? `show` : `hidden`}`);
    switch (args[0]) {
      case `combatactionbar`: {
        if (!args[1])
          return sendPlayerMessage(player, `\xA7qCombat Actionbar\xA7a is set to \xA72${combatActionbar ? `show` : `hidden`}`);
        if (![`show`, `hide`].includes(args[1]))
          return sendPlayerMessage(player, `\xA7cInvalid argument, please input \xA74show\xA7c, or\xA74 hide`);
        const value = args[1] === `show` ? true : false;
        clSettings.set(`showcombatactionbar`, value);
        sendPlayerMessage(player, `\xA7aSet \xA7qCombat Actionbar\xA7a to \xA7p${args[1]}`);
        break;
      }
      case `combatmessage`: {
        if (!args[1])
          return sendPlayerMessage(player, `\xA7qCombat Message\xA7a is set to \xA72${combatMessage ? `show` : `hidden`}`);
        if (args[1] == `interval`) {
          if (!args[2])
            return sendPlayerMessage(player, `\xA7qCombat Message Interval\xA7a is set to \xA72${combatMessageInterval ? `show` : `hidden`}`);
          if (isNaN(+args[2]))
            return sendPlayerMessage(player, `\xA7cPlease input a valid number`);
          if (+args[2] < 3)
            return sendPlayerMessage(player, `\xA7cInput a number more than 3`);
          clSettings.set(`combatmessageinterval`, `${+args[2] * 20}`);
          sendPlayerMessage(player, `\xA7aSet \xA7qCombat Message Interval\xA7a to \xA7p${timeStamp(+args[2])}`);
          return;
        }
        if (![`show`, `hide`].includes(args[1]))
          return sendPlayerMessage(player, `\xA7cInvalid argument, please input \xA74show\xA7c, or\xA74 hide`);
        const value = args[1] === `show` ? true : false;
        clSettings.set(`showcombatmessage`, value);
        sendPlayerMessage(player, `\xA7aSet \xA7qCombat Message\xA7a to \xA7p${args[1]}`);
        break;
      }
      case `spactionbar`:
      case `spawnkillactionbar`: {
        if (!args[1])
          return sendPlayerMessage(player, `\xA7qSpawnkill Actionbar\xA7a is set to \xA72${spActionbar ? `show` : `hidden`}`);
        if (![`show`, `hide`].includes(args[1]))
          return sendPlayerMessage(player, `\xA7cInvalid argument, please input \xA74show\xA7c, or\xA74 hide`);
        const value = args[1] === `show` ? true : false;
        clSettings.set(`showspawnkillactionbar`, value);
        sendPlayerMessage(player, `\xA7aSet \xA7qSpawnkill Actionbar\xA7a to \xA7p${args[1]}`);
        break;
      }
    }
  }
});

// src/combatlog/commands/staffOnly/bantime.ts
init_handler();
init_databases();
init_config();
init_commonUtils();
import { Player as Player6, CustomCommandParamType as CustomCommandParamType3, CommandPermissionLevel, CustomCommandStatus as CustomCommandStatus4, system as system6 } from "@minecraft/server";
var units = [`seconds`, `minutes`, `hours`, `days`, `weeks`];
SlashCommandBuilder.createEnum(`acl:unitOfTime`, units);
SlashCommandBuilder.createCommand({
  commandInfo: {
    name: `acl:bantime`,
    description: `How long a player is banned after combat logging`,
    mandatoryParameters: [{ name: `bantime`, type: CustomCommandParamType3.Integer }, { name: `acl:unitOfTime`, type: CustomCommandParamType3.Enum }],
    cheatsRequired: false,
    permissionLevel: CommandPermissionLevel.GameDirectors
  },
  callback(origin, bantime, unitOfTime) {
    const player = origin.sourceEntity;
    if (!(player instanceof Player6))
      return { status: CustomCommandStatus4.Failure, message: `Not a player` };
    system6.run(() => {
      if (unitOfTime === `minutes`)
        bantime = bantime * 60;
      if (unitOfTime === `hours`)
        bantime = bantime * 60 * 60;
      if (unitOfTime === `days`)
        bantime = bantime * 60 * 60 * 24;
      if (unitOfTime === `weeks`)
        bantime = bantime * 60 * 60 * 24 * 7;
      clSettings.set(`bantime`, Math.floor(bantime));
      sendPlayerMessage(player, `\xA7aSuccessfully set ban time to \xA7f${Math.floor(bantime)}s \xA77(${timeStamp2(bantime * 1e3)})`);
    });
    return { status: CustomCommandStatus4.Success };
  }
});
new Command({
  name: `bantime`,
  staffOnly: true,
  helpMenu: `\xA7e\xA7lAntiCL Help Page -- bantime\xA7r\xA7g
> Set the ban time (How long a player is banned after combat logging)

> Usage: ${config.prefix}bantime <amount>

> Aliases: [
    ${config.prefix}bantime
]

> Examples: [
    ${config.prefix}bantime
    ${config.prefix}bantime 30
    ${config.prefix}bantime 1minute
    ${config.prefix}bantime 1min
    ${config.prefix}bantime 1m
    ${config.prefix}bantime 24h
    ${config.prefix}bantime 1d
    ${config.prefix}bantime 1day
    ${config.prefix}bantime 4w
    ${config.prefix}bantime 4weeks
]`,
  callback({ player, args }) {
    if (args[0] == `default`) {
      clSettings.set(`bantime`, 30);
      sendPlayerMessage(player, `\xA7aSuccessfully set the combat time to \xA7f30s`);
      return;
    }
    if (!args[0])
      return sendPlayerMessage(player, `\xA7aBantime is set to ${clSettings.get(`bantime`)}`);
    if (args[0].endsWith(`m`) || args[0].endsWith(`minute`) || args[0].endsWith(`min`))
      args[0] = `${+args[0].replace(/[^\d\W]/g, ``) * 60}`;
    if (args[0].endsWith(`h`) || args[0].endsWith(`hour`) || args[0].endsWith(`hours`))
      args[0] = `${+args[0].replace(/[^\d\W]/g, ``) * 60 * 60}`;
    if (args[0].endsWith(`d`) || args[0].endsWith(`day`) || args[0].endsWith(`days`))
      args[0] = `${+args[0].replace(/[^\d\W]/g, ``) * 60 * 60 * 24}`;
    if (args[0].endsWith(`w`) || args[0].endsWith(`week`) || args[0].endsWith(`weeks`))
      args[0] = `${+args[0].replace(/[^\d\W]/g, ``) * 60 * 60 * 24 * 7}`;
    if (isNaN(+args[0]))
      return sendPlayerMessage(player, `\xA7cThat isn't a number!`);
    if (+args[0] < 0 || +args[0] > 2419200)
      return sendPlayerMessage(player, `\xA7cYou can only set the ban time to seconds between 0 and 2419200 (4 weeks)!`);
    clSettings.set(`bantime`, Math.floor(+args[0]));
    sendPlayerMessage(player, `\xA7aSuccessfully set ban time to \xA7f${Math.floor(+args[0])}s \xA77(${timeStamp2(+args[0] * 1e3)})`);
  }
});
var timeStamp2 = (time) => {
  let seconds = Math.floor(time / 1e3);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  seconds %= 60;
  minutes %= 60;
  hours %= 24;
  days %= 7;
  const duration = [];
  if (weeks)
    duration.push(`${weeks} week${weeks > 1 ? `s` : ``}`);
  if (days)
    duration.push(`${days} day${days > 1 ? `s` : ``}`);
  if (hours)
    duration.push(`${hours} hour${hours > 1 ? `s` : ``}`);
  if (minutes)
    duration.push(`${minutes} minute${minutes > 1 ? `s` : ``}`);
  if (seconds)
    duration.push(`${seconds} second${seconds > 1 ? `s` : ``}`);
  if (duration.length)
    return duration.join(`, `);
  else
    return `0 seconds`;
};

// src/combatlog/commands/staffOnly/combattime.ts
init_handler();
init_databases();
init_config();
init_commonUtils();
import { Player as Player7, CustomCommandParamType as CustomCommandParamType4, CustomCommandStatus as CustomCommandStatus5, system as system7, CommandPermissionLevel as CommandPermissionLevel2 } from "@minecraft/server";
var units2 = [`default`, `seconds`, `minutes`];
SlashCommandBuilder.createEnum(`acl:combatUnit`, units2);
SlashCommandBuilder.createCommand({
  commandInfo: {
    name: `acl:combattime`,
    description: `Set how long a player is in combat for after being tagged`,
    mandatoryParameters: [{ name: `combatTime`, type: CustomCommandParamType4.Integer }, { name: `acl:combatUnit`, type: CustomCommandParamType4.Enum }],
    cheatsRequired: false,
    permissionLevel: CommandPermissionLevel2.GameDirectors
  },
  callback(origin, combattime, unitOfTime) {
    const player = origin.sourceEntity;
    if (!(player instanceof Player7))
      return { status: CustomCommandStatus5.Failure, message: `Not a player` };
    system7.run(() => {
      if (unitOfTime === `default`) {
        clSettings.set(`combattime`, 30);
        sendPlayerMessage(player, `\xA7aSuccessfully set the combat time to \xA7f30s`);
        return;
      }
      if (unitOfTime === `minutes`)
        combattime = combattime * 60;
      if (unitOfTime === `hours`)
        combattime = combattime * 60 * 60;
      if (combattime < 3 || combattime > 180)
        return sendPlayerMessage(player, `\xA7cYou can only set the combat time to seconds between 3 and 180!`);
      clSettings.set(`combattime`, Math.floor(combattime));
      sendPlayerMessage(player, `\xA7aSuccessfully set combat time to \xA7f${Math.floor(combattime)}s \xA77(${timeStamp(combattime * 1e3)})`);
    });
    return { status: CustomCommandStatus5.Success };
  }
});
new Command({
  name: `combattime`,
  aliases: [`combattimer`, `cltime`, `cltimer`],
  staffOnly: true,
  helpMenu: `\xA7e\xA7lAntiCL Help Page -- combattime\xA7r\xA7g
> Set the combat time

> Usage: ${config.prefix}combattimer <amount>

> Aliases: [
    ${config.prefix}combattimer
    ${config.prefix}cltime
    ${config.prefix}cltimer
]

> Examples: [
    ${config.prefix}combattime
    ${config.prefix}combattime 30
    ${config.prefix}combattime 1min
    ${config.prefix}combattime 1minute
    ${config.prefix}combattime 1m
]`,
  callback({ player, args }) {
    if (args[0] === `default`) {
      clSettings.set(`combattime`, 30);
      sendPlayerMessage(player, `\xA7aSuccessfully set the combat time to \xA7f30s`);
      return;
    }
    if (!args[0])
      return sendPlayerMessage(player, `\xA7aCombattime is set to ${clSettings.get(`combattime`)}`);
    if (args[0].endsWith(`m`) || args[0].endsWith(`minute`) || args[0].endsWith(`min`))
      args[0] = `${+args[0].replace(/[^\d\W]/g, ``) * 60}`;
    if (isNaN(+args[0]))
      return sendPlayerMessage(player, `\xA7cThat isn't a number!`);
    if (+args[0] < 3 || +args[0] > 180)
      return sendPlayerMessage(player, `\xA7cYou can only set the combat time to seconds between 3 and 180!`);
    clSettings.set(`combattime`, Math.floor(+args[0]));
    sendPlayerMessage(player, `\xA7aSuccessfully set combat time to \xA7f${Math.floor(+args[0])}s \xA77(${timeStamp(+args[0] * 1e3)})`);
  }
});

// src/combatlog/commands/staffOnly/safezone.ts
init_databases();
init_config();
init_commonUtils();
init_handler();
var savedPos1Map = /* @__PURE__ */ new Map();
var savedPos2Map = /* @__PURE__ */ new Map();
new Command({
  name: `safezone`,
  staffOnly: true,
  helpMenu: `\xA7e\xA7lAntiCL Help Page -- safezone\xA7r\xA7g
> Safezone commands

> Subcommands: [
    pos1 - Sets position 1 at the player's location
    pos2 - Sets position 2 at the player's location
    pvpcreate - Creates a PVP safezone between pos1 and pos2
    protcreate - Creates a block safezone between pos1 and pos2
    remove - Removes the safezone you're currently in or removes the safezone you specify
    list - Lists all safezones and their coords
    show - Toggles showing safezones
]

> Examples: [
    ${config.prefix}safezone pos1
    ${config.prefix}safezone pos2
    ${config.prefix}safezone remove 5 5 5 -5 -5 -5
    ${config.prefix}safezone pvpcreate
    ${config.prefix}safezone protcreate
    ${config.prefix}safezone list
    ${config.prefix}safezone show
]`,
  callback({ player, args }) {
    switch (args[0]) {
      default:
        return sendPlayerMessage(player, `\xA7cDo ==help safezone for a list of subcommands`);
      case `pos1`:
        return pos1(player);
      case `pos2`:
        return pos2(player);
      case `pvpcreate`:
        return create(player, false);
      case `protcreate`:
        return create(player, true);
      case `remove`:
        return remove(player, args);
      case `list`:
        return list(player);
      case `show`:
        return show(player);
      case `clear123`:
        return safezones.clear();
    }
  }
});
function pos1(player) {
  const location = player.dimension.getBlock(player.location).location;
  if (location.y < -64 || location.y > 320)
    return sendPlayerMessage(player, `\xA7cOut of bounds`);
  savedPos1Map.set(player.id, location);
  sendPlayerMessage(player, `\xA7aPosition 1 set to ${Object.values(location).join(` `)}`);
}
function pos2(player) {
  const location = player.dimension.getBlock(player.location).location;
  if (location.y < -64 || location.y > 320)
    return sendPlayerMessage(player, `\xA7cOut of bounds`);
  savedPos2Map.set(player.id, location);
  sendPlayerMessage(player, `\xA7aPosition 2 set to ${Object.values(location).join(` `)}`);
}
function create(player, prot) {
  const savedPos1 = savedPos1Map.get(player.id);
  const savedPos2 = savedPos2Map.get(player.id);
  if (!savedPos1)
    return sendPlayerMessage(player, `\xA7cPosition 1 unselected`);
  if (!savedPos2)
    return sendPlayerMessage(player, `\xA7cPosition 2 unselected`);
  const coords = [...Object.values(savedPos1), ...Object.values(savedPos2)].join(`--`);
  const existingSafezone = safezones.get(coords);
  if (existingSafezone) {
    if (existingSafezone !== `both` && JSON.parse(existingSafezone) === prot)
      return sendPlayerMessage(player, `\xA7cThere is already a safezone there of the same type!`);
    safezones.set(coords, `both`);
    sendPlayerMessage(player, `\xA7aAdded a ${prot ? `block` : `pvp`} safezone to the exisitng (${existingSafezone ? `block` : `pvp`}) safezone \xA7f${Object.values(savedPos1).join(` `)}\xA7a and \xA7f${Object.values(savedPos2).join(` `)}`);
    return;
  }
  safezones.set(coords, `${prot}`);
  sendPlayerMessage(player, `\xA7aAdded a ${prot ? `block` : `pvp`} safezone between \xA7f${Object.values(savedPos1).join(` `)}\xA7a and \xA7f${Object.values(savedPos2).join(` `)}`);
}
function remove(player, args) {
  let coords;
  if (!args[1]) {
    const savedPos1 = savedPos1Map.get(player.id);
    const savedPos2 = savedPos2Map.get(player.id);
    if (!savedPos1)
      return sendPlayerMessage(player, `\xA7cPosition 1 unselected`);
    if (!savedPos2)
      return sendPlayerMessage(player, `\xA7cPosition 2 unselected`);
    coords = [...Object.values(savedPos1), ...Object.values(savedPos2)].join(`--`);
  } else
    coords = `${args[1]}--${args[2]}--${args[3]}--${args[4]}--${args[5]}--${args[6]}`;
  if (!safezones.has(`${coords}`))
    return sendPlayerMessage(player, `\xA7cNo safezone detected between those coords!`);
  const coordParts = coords.split(`--`);
  const pos12 = coordParts.slice(0, 3).join(` `);
  const pos22 = coordParts.slice(3, 6).join(` `);
  safezones.delete(`${coords}`);
  sendPlayerMessage(player, `\xA7aDeleted the safezone/s between \xA7f${pos12}\xA7a and \xA7f${pos22}`);
}
function list(player) {
  sendPlayerMessage(player, `\xA79Safezones:
${Array.from(safezones.entries()).map((x) => `\xA7u${x[0].split(`--`).join(` `)} BlockSafezone: \xA73${x[1]}
`).join(`
`)}`);
}
function show(player) {
  const showingSafezones = player.hasTag(`cl-showsafezones`);
  if (showingSafezones)
    player.removeTag(`cl-showsafezones`);
  else
    player.addTag(`cl-showsafezones`);
  sendPlayerMessage(player, `\xA7a${showingSafezones ? `No longer` : `Now`} showing safezones`);
}

// src/combatlog/commands/staffOnly/crystalpvp.ts
init_databases();
init_commonUtils();
init_handler();
import { CustomCommandParamType as CustomCommandParamType5, CommandPermissionLevel as CommandPermissionLevel3, Player as Player8, CustomCommandStatus as CustomCommandStatus6, system as system8 } from "@minecraft/server";
SlashCommandBuilder.createCommand({
  commandInfo: {
    name: `acl:crystalpvp`,
    description: `Set if crystal pvp is allowed`,
    mandatoryParameters: [{ name: `crystalPvp`, type: CustomCommandParamType5.Boolean }],
    cheatsRequired: false,
    permissionLevel: CommandPermissionLevel3.GameDirectors
  },
  callback(origin, crystalPvp) {
    const player = origin.sourceEntity;
    if (!(player instanceof Player8))
      return { status: CustomCommandStatus6.Failure, message: `Not a player` };
    system8.run(() => {
      clSettings.set(`crystalpvp`, `${crystalPvp}`);
      sendPlayerMessage(player, `\xA7aSuccessfully set CrystalPVP to \xA7f${crystalPvp}`);
    });
    return { status: CustomCommandStatus6.Success };
  }
});
new Command({
  name: `crystalpvp`,
  staffOnly: true,
  callback({ player, args }) {
    if (!args[0])
      return sendPlayerMessage(player, `\xA7aCrystalPVP is set to ${clSettings.get(`crystalpvp`)}`);
    if (![`true`, `false`].includes(args[0].toLowerCase()))
      return sendPlayerMessage(player, `\xA7cError, must be true || false`);
    clSettings.set(`crystalpvp`, args[0].toLowerCase());
    sendPlayerMessage(player, `\xA7aSuccessfully set CrystalPVP to \xA7f${args[0]}`);
  }
});

// src/combatlog/commands/staffOnly/disableflycombat.ts
init_databases();
init_commonUtils();
init_handler();
import { CustomCommandParamType as CustomCommandParamType6, CommandPermissionLevel as CommandPermissionLevel4, Player as Player9, CustomCommandStatus as CustomCommandStatus7, system as system9 } from "@minecraft/server";
SlashCommandBuilder.createCommand({
  commandInfo: {
    name: `acl:disableflycombat`,
    description: `Set whether or not elytra is allowed when in combat`,
    mandatoryParameters: [{ name: `disableElytraCombat`, type: CustomCommandParamType6.Boolean }],
    cheatsRequired: false,
    permissionLevel: CommandPermissionLevel4.GameDirectors
  },
  callback(origin, disableElytraCombat) {
    const player = origin.sourceEntity;
    if (!(player instanceof Player9))
      return { status: CustomCommandStatus7.Failure, message: `Not a player` };
    system9.run(() => {
      clSettings.set(`disableelytracombat`, `${disableElytraCombat}`);
      sendPlayerMessage(player, `\xA7aSuccessfully set DisableElytraCombat to \xA7f${disableElytraCombat}`);
    });
    return { status: CustomCommandStatus7.Success };
  }
});
new Command({
  name: `disableelytracombat`,
  aliases: [`disableflycombat`, `dfc`, `disablefc`],
  staffOnly: true,
  callback({ player, args }) {
    if (!args[0])
      return sendPlayerMessage(player, `\xA7aDisableElytraCombat is set to ${clSettings.get(`disableelytracombat`)}`);
    if (![`true`, `false`].includes(args[0].toLowerCase()))
      return sendPlayerMessage(player, `\xA7cError, must be true || false`);
    clSettings.set(`disableelytracombat`, args[0].toLowerCase());
    sendPlayerMessage(player, `\xA7aSuccessfully set DisableElytraCombat to \xA7f${args[0]}`);
  }
});

// src/combatlog/commands/staffOnly/disabletpcombat.ts
init_handler();
init_databases();
init_config();
init_commonUtils();
import { Player as Player10, CommandPermissionLevel as CommandPermissionLevel5, CustomCommandParamType as CustomCommandParamType7, CustomCommandStatus as CustomCommandStatus8, system as system10 } from "@minecraft/server";
SlashCommandBuilder.createCommand({
  commandInfo: {
    name: `acl:disabletpcombat`,
    description: `Set whether or not teleporting (e.g with an ender pearl or a stasis chamber) is allowed when in combat`,
    mandatoryParameters: [{ name: `disableTpCombat`, type: CustomCommandParamType7.Boolean }],
    cheatsRequired: false,
    permissionLevel: CommandPermissionLevel5.GameDirectors
  },
  callback(origin, disableTpCombat) {
    const player = origin.sourceEntity;
    if (!(player instanceof Player10))
      return { status: CustomCommandStatus8.Failure, message: `Not a player` };
    system10.run(() => {
      clSettings.set(`disabletpcombat`, `${disableTpCombat}`);
      sendPlayerMessage(player, `\xA7aSuccessfully set DisableTPCombat to \xA7f${disableTpCombat}`);
    });
    return { status: CustomCommandStatus8.Success };
  }
});
new Command({
  name: `disabletpcombat`,
  aliases: [`disabletp`, `disabletpcomb`, `dtpc`],
  staffOnly: true,
  helpMenu: `\xA7e\xA7lAntiCL Help Page -- disabletpcombat\xA7r\xA7g
> Whether or not to disable ender pearls during combat

> Usage: ${config.prefix}disabletpcombat <true/false>

> Aliases: [
    ${config.prefix}disabletp
    ${config.prefix}disabletpcomb
    ${config.prefix}dtpc

> Examples: [
    ${config.prefix}disabletpcombat true
    ${config.prefix}disabletp true
    ${config.prefix}disabletpcomb false
    ${config.prefix}dtpc false
]`,
  callback({ player, args }) {
    if (!args[0])
      return sendPlayerMessage(player, `\xA7aDisabletpincombat is set to ${clSettings.get(`disabletpcombat`)}`);
    if (![`true`, `false`].includes(args[0].toLowerCase()))
      return sendPlayerMessage(player, `\xA7cError, must be true || false`);
    clSettings.set(`disabletpcombat`, args[0].toLowerCase());
    sendPlayerMessage(player, `\xA7aSuccessfully set DisableTPcombat to \xA7f${args[0]}`);
  }
});

// src/combatlog/commands/staffOnly/itemblacklist.ts
init_handler();
init_databases();
init_config();
init_commonUtils();
import { Player as Player11, ItemStack, CommandPermissionLevel as CommandPermissionLevel6, CustomCommandParamType as CustomCommandParamType8, CustomCommandStatus as CustomCommandStatus9, system as system11 } from "@minecraft/server";
SlashCommandBuilder.createCommand({
  commandInfo: {
    name: `acl:itemblacklist`,
    description: `Blacklist certain items`,
    permissionLevel: CommandPermissionLevel6.Admin,
    cheatsRequired: false,
    optionalParameters: [{ name: `itemId`, type: CustomCommandParamType8.String }]
  },
  callback(origin, itemId) {
    const player = origin.sourceEntity;
    if (!(player instanceof Player11))
      return { status: CustomCommandStatus9.Failure, message: `Not a player` };
    system11.run(() => {
      if (!itemId)
        return sendPlayerMessage(player, `\xA7eBlacklisted items:
\xA76${Array.from(itemblacklist.keys()).join(`
`)}`);
      if (itemblacklist.has(`${itemId.toLowerCase()}`)) {
        itemblacklist.delete(`${itemId.toLowerCase()}`);
        sendPlayerMessage(player, `\xA7aSuccessfully removed ${itemId} from item blacklist`);
        return;
      }
      try {
        new ItemStack(`${itemId}`);
      } catch {
        return sendPlayerMessage(player, `\xA7cItem doesn't exist, make sure you entered the right ID`);
      }
      itemblacklist.set(`${itemId.toLowerCase()}`, itemId.toLowerCase());
      sendPlayerMessage(player, `\xA7aSuccessfully added ${itemId} to item blacklist`);
    });
    return { status: CustomCommandStatus9.Success };
  }
});
new Command({
  name: `itemblacklist`,
  aliases: [`iblacklist`],
  staffOnly: true,
  helpMenu: `\xA7e\xA7lAntiCL Help Page -- iblacklist\xA7r\xA7g
> Blacklist certain items

> Usage: ${config.prefix}iblacklist <itemid>

> Aliases: [
    ${config.prefix}iblacklist
    ${config.prefix}itemblacklist

> Examples: [
    ${config.prefix}iblacklist minecraft:ender_pearl
    ${config.prefix}itemblacklist
]`,
  callback({ player, args }) {
    if (!args[0])
      return sendPlayerMessage(player, `\xA7eBlacklisted items:
\xA76${Array.from(itemblacklist.keys()).join(`
`)}`);
    if (itemblacklist.has(`${args[0]}`)) {
      itemblacklist.delete(`${args[0].toLowerCase()}`);
      sendPlayerMessage(player, `\xA7aSuccessfully removed ${args[0]} from item blacklist`);
      return;
    }
    try {
      new ItemStack(`${args[0]}`);
    } catch {
      return sendPlayerMessage(player, `\xA7cItem doesn't exist, make sure you entered the right ID`);
    }
    itemblacklist.set(`${args[0].toLowerCase()}`, args[0].toLowerCase());
    sendPlayerMessage(player, `\xA7aSuccessfully added ${args[0]} to item blacklist`);
  }
});

// src/combatlog/commands/staffOnly/itemdroplog.ts
init_databases();
init_commonUtils();
init_handler();
new Command({
  name: `itemdroplog`,
  aliases: [`itemdroponlog`, `itemdrop`],
  staffOnly: true,
  callback({ player, args }) {
    if (!args[0])
      return sendPlayerMessage(player, `\xA7aItemdroplog is set to ${clSettings.get(`itemdroplog`)}`);
    if (![`true`, `false`].includes(args[0].toLowerCase()))
      return sendPlayerMessage(player, `\xA7cError, must be true || false`);
    clSettings.set(`itemdroplog`, args[0].toLowerCase());
    sendPlayerMessage(player, `\xA7aSuccessfully set itemdroplog to \xA7f${args[0]}`);
  }
});

// src/combatlog/commands/staffOnly/mobtriggerlog.ts
init_handler();
init_config();
init_commonUtils();
init_databases();
import { Player as Player12, CommandPermissionLevel as CommandPermissionLevel7, CustomCommandParamType as CustomCommandParamType9, CustomCommandStatus as CustomCommandStatus10, system as system12 } from "@minecraft/server";
SlashCommandBuilder.createCommand({
  commandInfo: {
    name: `acl:mobtriggerlog`,
    description: `Set whether or not mobs trigger combat`,
    mandatoryParameters: [{ name: `mobTriggerLog`, type: CustomCommandParamType9.Boolean }],
    cheatsRequired: false,
    permissionLevel: CommandPermissionLevel7.GameDirectors
  },
  callback(origin, mobTriggerLog) {
    const player = origin.sourceEntity;
    if (!(player instanceof Player12))
      return { status: CustomCommandStatus10.Failure, message: `Not a player` };
    system12.run(() => {
      clSettings.set(`mobtriggerlog`, `${mobTriggerLog}`);
      sendPlayerMessage(player, `\xA7aSuccessfully set mobtriggerlog to \xA7f${mobTriggerLog}`);
    });
    return { status: CustomCommandStatus10.Success };
  }
});
new Command({
  name: `mobtriggerlog`,
  aliases: [`moblog`, `mobtriggerclog`, `mobclog`],
  staffOnly: true,
  helpMenu: `\xA7e\xA7lAntiCL Help Page -- mobtriggerlog\xA7r\xA7g
> Whether or not mobs trigger combat

> Usage: ${config.prefix}mobtriggerlog

> Aliases: [
    ${config.prefix}moblog
    ${config.prefix}mobtriggerclog
    ${config.prefix}mobclog

> Examples: [
    ${config.prefix}mobtriggerlog true
    ${config.prefix}moblog false
]`,
  callback({ player, args }) {
    if (!args[0])
      return sendPlayerMessage(player, `\xA7aMobtriggerlog is set to ${clSettings.get(`mobtriggerlog`)}`);
    if (![`true`, `false`].includes(args[0].toLowerCase()))
      return sendPlayerMessage(player, `\xA7cError, must be true || false`);
    clSettings.set(`mobtriggerlog`, args[0].toLowerCase());
    sendPlayerMessage(player, `\xA7aSuccessfully set mobtriggerlog to \xA7f${args[0]}`);
  }
});

// src/combatlog/commands/staffOnly/potionscombat.ts
init_databases();
init_commonUtils();
init_handler();
import { CustomCommandParamType as CustomCommandParamType10, CommandPermissionLevel as CommandPermissionLevel8, Player as Player13, CustomCommandStatus as CustomCommandStatus11, system as system13 } from "@minecraft/server";
SlashCommandBuilder.createCommand({
  commandInfo: {
    name: `acl:potionsincombat`,
    description: `Set whether or not potions are allowed in combat`,
    mandatoryParameters: [{ name: `potionsInCombat`, type: CustomCommandParamType10.Boolean }],
    cheatsRequired: false,
    permissionLevel: CommandPermissionLevel8.GameDirectors
  },
  callback(origin, potionsInCombat) {
    const player = origin.sourceEntity;
    if (!(player instanceof Player13))
      return { status: CustomCommandStatus11.Failure, message: `Not a player` };
    system13.run(() => {
      clSettings.set(`potionsincombat`, `${potionsInCombat}`);
      sendPlayerMessage(player, `\xA7aSuccessfully set potionsInCombat to \xA7f${potionsInCombat}`);
    });
    return { status: CustomCommandStatus11.Success };
  }
});
new Command({
  name: `potionsincombat`,
  aliases: [`potionscombat`, `potscombat`, `potsallowed`, `potscom`, `potsincombat`],
  staffOnly: true,
  callback({ player, args }) {
    if (!args[0])
      return sendPlayerMessage(player, `\xA7aPotsInCombat is set to ${clSettings.get(`potionsincombat`)}`);
    if (![`true`, `false`].includes(args[0].toLowerCase()))
      return sendPlayerMessage(player, `\xA7cError, must be true || false`);
    clSettings.set(`potionsincombat`, args[0].toLowerCase());
    sendPlayerMessage(player, `\xA7aSuccessfully set PotsInCombat to \xA7f${args[0]}`);
  }
});

// src/combatlog/commands/staffOnly/sptime.ts
init_handler();
init_databases();
init_config();
init_commonUtils();
import { Player as Player14, CommandPermissionLevel as CommandPermissionLevel9, CustomCommandParamType as CustomCommandParamType11, CustomCommandStatus as CustomCommandStatus12, system as system14 } from "@minecraft/server";
var units3 = [`default`, `disable`, `seconds`, `minutes`];
SlashCommandBuilder.createEnum(`acl:spUnit`, units3);
SlashCommandBuilder.createCommand({
  commandInfo: {
    name: `acl:spawnkilltime`,
    description: `Set how long a player is in spawn protection for after respawning`,
    mandatoryParameters: [{ name: `spawnkillTime`, type: CustomCommandParamType11.Integer }, { name: `acl:spUnit`, type: CustomCommandParamType11.Enum }],
    cheatsRequired: false,
    permissionLevel: CommandPermissionLevel9.GameDirectors
  },
  callback(origin, spawnkillTime, unitOfTime) {
    const player = origin.sourceEntity;
    if (!(player instanceof Player14))
      return { status: CustomCommandStatus12.Failure, message: `Not a player` };
    system14.run(() => {
      if (unitOfTime === `default`) {
        clSettings.set(`combattime`, 30);
        sendPlayerMessage(player, `\xA7aSuccessfully set the combat time to \xA7f30s`);
        return;
      }
      if (unitOfTime === `disable`) {
        clSettings.set(`spawnkilltime`, 0);
        sendPlayerMessage(player, `\xA7aSuccessfully disabled spawnkill protection`);
        return;
      }
      if (unitOfTime === `minutes`)
        spawnkillTime = spawnkillTime * 60;
      if (unitOfTime === `hours`)
        spawnkillTime = spawnkillTime * 60 * 60;
      if (spawnkillTime < 3 || spawnkillTime > 600)
        return sendPlayerMessage(player, `\xA7cYou can only set the spawnkill time to seconds between 3 and 600!`);
      clSettings.set(`spawnkilltime`, Math.floor(spawnkillTime));
      sendPlayerMessage(player, `\xA7aSuccessfully set spawnkill time to \xA7f${Math.floor(spawnkillTime)}s \xA77(${timeStamp4(spawnkillTime * 1e3)})`);
    });
    return { status: CustomCommandStatus12.Success };
  }
});
new Command({
  name: `spawnkilltime`,
  aliases: [`sptime`],
  helpMenu: `\xA7e\xA7lAntiCL Help Page -- spawnkilltime\xA7r\xA7g
> Set the spawn kill protection time (Amount of time before players can damage killed players again)

> Usage: ${config.prefix}spawnkilltime <amount/disable>

> Aliases: [
    ${config.prefix}sptime
]

> Examples: [
    ${config.prefix}spawnkilltime 30
    ${config.prefix}spawnkilltime 1minute
    ${config.prefix}sptime 1min
    ${config.prefix}sptime 1m
    ${config.prefix}sptime disable
]`,
  callback({ player, args }) {
    if (args[0] == `default`) {
      clSettings.set(`spawnkilltime`, 30);
      args[0] = `30`;
      sendPlayerMessage(player, `\xA7aSuccessfully set spawnkill time to \xA7f${+args[0]}s (${(+args[0] / 60).toFixed(2)} ${+args[0] / 60 == 1 ? `minute` : `minutes`})`);
      return;
    }
    if (args[0] == `disable`) {
      clSettings.set(`spawnkilltime`, 0);
      sendPlayerMessage(player, `\xA7aSuccessfully disabled spawnkill protection`);
      return;
    }
    if (!args[0])
      return sendPlayerMessage(player, `\xA7aSpawnkilltime is set to ${clSettings.get(`spawnkilltime`)}`);
    if (args[0].endsWith(`m`) || args[0].endsWith(`minute`) || args[0].endsWith(`min`))
      args[0] = `${+args[0].replace(/[^\d\W]/g, ``) * 60}`;
    if (isNaN(+args[0]))
      return sendPlayerMessage(player, `\xA7cThat isn't a number!`);
    if (+args[0] < 3 || +args[0] > 600)
      return sendPlayerMessage(player, `\xA7cYou can only set the spawnkill time to seconds between 3 and 600!`);
    clSettings.set(`spawnkilltime`, Math.floor(+args[0]));
    sendPlayerMessage(player, `\xA7aSuccessfully set spawnkill time to \xA7f${Math.floor(+args[0])}s \xA77(${timeStamp4(+args[0] * 1e3)})`);
  }
});
var timeStamp4 = (time) => {
  let seconds = Math.floor(time / 1e3);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  seconds %= 60;
  minutes %= 60;
  hours %= 24;
  days %= 7;
  const duration = [];
  if (weeks)
    duration.push(`${weeks} week${weeks > 1 ? `s` : ``}`);
  if (days)
    duration.push(`${days} day${days > 1 ? `s` : ``}`);
  if (hours)
    duration.push(`${hours} hour${hours > 1 ? `s` : ``}`);
  if (minutes)
    duration.push(`${minutes} minute${minutes > 1 ? `s` : ``}`);
  if (seconds)
    duration.push(`${seconds} second${seconds > 1 ? `s` : ``}`);
  if (duration.length)
    return duration.join(`, `);
  else
    return `0 seconds`;
};

// src/combatlog/commands/staffOnly/logpunishment.ts
init_handler();
init_commonUtils();
init_databases();
import { CommandPermissionLevel as CommandPermissionLevel10, CustomCommandParamType as CustomCommandParamType12, CustomCommandStatus as CustomCommandStatus13, Player as Player15, system as system15 } from "@minecraft/server";
var logPunishment = [`killAndItemsDropImmediately`, `killAndDropAfterRejoin`, `ban`, `none`];
SlashCommandBuilder.createEnum(`acl:logPunishment`, logPunishment);
SlashCommandBuilder.createCommand({
  commandInfo: {
    name: `acl:logpunishment`,
    description: `Set punishment for when someone combat logs`,
    mandatoryParameters: [{ name: `acl:logPunishment`, type: CustomCommandParamType12.Enum }],
    cheatsRequired: false,
    permissionLevel: CommandPermissionLevel10.GameDirectors
  },
  callback(origin, itemDropLog) {
    const player = origin.sourceEntity;
    if (!(player instanceof Player15))
      return { status: CustomCommandStatus13.Failure, message: `Not a player` };
    system15.run(() => {
      switch (itemDropLog) {
        case `none`: {
          clSettings.set(`disablepunish`, `true`);
          break;
        }
        case `ban`: {
          sendPlayerMessage(player, `\xA77This option doesn't do anything :)
\xA7lUse the /acl:bantime command to set ban time (0 to disable)`);
          break;
        }
        case `killAndItemsDropImmediately`: {
          clSettings.set(`itemdroplog`, `true`);
          sendPlayerMessage(player, `\xA7aSet itemDropLog to true`);
          break;
        }
        case `killAndDropAfterRejoin`: {
          clSettings.set(`itemdroplog`, `false`);
          sendPlayerMessage(player, `\xA7aSet itemDropLog to false`);
          break;
        }
      }
    });
    return { status: CustomCommandStatus13.Success };
  }
});

// src/combatlog/commands/debug/randomDebug.ts
init_handler();
new Command({
  name: `randomdebug`,
  staffOnly: true,
  callback({ player, args }) {
    player.getComponent(`inventory`).container.clearAll();
  }
});

// src/combatlog/system/startUp.ts
init_handler();
import { system as system16 } from "@minecraft/server";
system16.beforeEvents.startup.subscribe((data) => {
  SlashCommandBuilder.registerCommands(data.customCommandRegistry);
});

// src/main.ts
var scoreboards = [
  `combatlog`,
  `spawnkill`
];
var defaultSettings = {
  combattime: `30`,
  spawnkilltime: `30`,
  bantime: `0`,
  mobtriggerlog: `false`,
  disabletpcombat: `false`,
  itemdroplog: `false`,
  disableelytracombat: `false`,
  crystalpvp: `true`,
  potionsincombat: `true`,
  showcombatmessage: `false`,
  combatmessageinterval: `60`,
  showcombatactionbar: `true`,
  showspawnkillactionbar: `true`,
  disablepunish: `false`
};
world22.afterEvents.worldLoad.subscribe(() => {
  for (const key in defaultSettings) {
    if (!clSettings.has(key)) {
      clSettings.set(key, defaultSettings[key]);
    }
  }
  for (const scoreboard of scoreboards) {
    try {
      world22.scoreboard.addObjective(scoreboard);
    } catch {
    }
  }
  Promise.resolve().then(() => init_entityDie());
  Promise.resolve().then(() => init_entityHurt());
  Promise.resolve().then(() => init_entityHurt2());
  Promise.resolve().then(() => init_itemUse());
  Promise.resolve().then(() => init_playerBreakBlock());
  Promise.resolve().then(() => init_playerInteractBlock());
  Promise.resolve().then(() => init_playerLeave());
  Promise.resolve().then(() => init_playerPlaceBlock());
  Promise.resolve().then(() => init_playerSpawn());
  Promise.resolve().then(() => init_runInterval());
});
/*!
 * Creator & Developer of this file: PAPISOP
 * Discord Username of PAPISOP: papisop (https://discord.com/users/457793443465527306)
 *
 * This file, created by PAPISOP, is licensed under CC BY-NC-ND 4.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-nd/4.0/
 */
