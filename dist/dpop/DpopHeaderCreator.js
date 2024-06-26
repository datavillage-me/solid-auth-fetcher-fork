"use strict";
var __decorate =
  (this && this.__decorate) ||
  function(decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
var __param =
  (this && this.__param) ||
  function(paramIndex, decorator) {
    return function(target, key) {
      decorator(target, key, paramIndex);
    };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
let DpopHeaderCreator = class DpopHeaderCreator {
  constructor(joseUtility, dpopClientKeyManager, uuidGenerator) {
    this.joseUtility = joseUtility;
    this.dpopClientKeyManager = dpopClientKeyManager;
    this.uuidGenerator = uuidGenerator;
  }
  normalizeHtu(audience) {
    return `${audience.origin}${audience.pathname}`;
  }
  async createHeaderToken(audience, method) {
    await this.dpopClientKeyManager.generateClientKeyIfNotAlready();
    const clientKey = await this.dpopClientKeyManager.getClientKey();
    if (clientKey === undefined) {
      throw new Error("Could not obtain the key to sign the token with.");
    }
    return this.joseUtility.signJWT(
      {
        htu: this.normalizeHtu(audience),
        htm: method,
        jti: this.uuidGenerator.v4()
      },
      clientKey,
      {
        header: {
          jwk: await this.joseUtility.privateJWKToPublicJWK(clientKey),
          typ: "dpop+jwt"
        },
        expiresIn: "1 hour",
        algorithm: "ES256"
      }
    );
  }
};
DpopHeaderCreator = __decorate(
  [
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject("joseUtility")),
    __param(1, tsyringe_1.inject("dpopClientKeyManager")),
    __param(2, tsyringe_1.inject("uuidGenerator")),
    __metadata("design:paramtypes", [Object, Object, Object])
  ],
  DpopHeaderCreator
);
exports.default = DpopHeaderCreator;
//# sourceMappingURL=DpopHeaderCreator.js.map
