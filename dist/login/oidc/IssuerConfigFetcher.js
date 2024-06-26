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
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const url_parse_1 = __importDefault(require("url-parse"));
const tsyringe_1 = require("tsyringe");
const issuerConfigSchema_1 = __importDefault(require("./issuerConfigSchema"));
const ConfigurationError_1 = __importDefault(
  require("../../errors/ConfigurationError")
);
const issuerConfigKeyMap = {
  issuer: {
    toKey: "issuer",
    convertToUrl: true
  },
  authorization_endpoint: {
    toKey: "authorizationEndpoint",
    convertToUrl: true
  },
  token_endpoint: {
    toKey: "tokenEndpoint",
    convertToUrl: true
  },
  userinfo_endpoint: {
    toKey: "userinfoEndpoint",
    convertToUrl: true
  },
  jwks_uri: {
    toKey: "jwksUri",
    convertToUrl: true
  },
  registration_endpoint: {
    toKey: "registrationEndpoint",
    convertToUrl: true
  },
  scopes_supported: { toKey: "scopesSupported" },
  response_types_supported: { toKey: "responseTypesSupported" },
  response_modes_supported: { toKey: "responseModesSupported" },
  grant_types_supported: { toKey: "grantTypesSupported" },
  acr_values_supported: { toKey: "acrValuesSupported" },
  subject_types_supported: { toKey: "subjectTypesSupported" },
  id_token_signing_alg_values_supported: {
    toKey: "idTokenSigningAlgValuesSupported"
  },
  id_token_encryption_alg_values_supported: {
    toKey: "idTokenEncryptionAlgValuesSupported"
  },
  id_token_encryption_enc_values_supported: {
    toKey: "idTokenEncryptionEncValuesSupported"
  },
  userinfo_signing_alg_values_supported: {
    toKey: "userinfoSigningAlgValuesSupported"
  },
  userinfo_encryption_alg_values_supported: {
    toKey: "userinfoEncryptionAlgValuesSupported"
  },
  userinfo_encryption_enc_values_supported: {
    toKey: "userinfoEncryptionEncValuesSupported"
  },
  request_object_signing_alg_values_supported: {
    toKey: "requestObjectSigningAlgValuesSupported"
  },
  request_object_encryption_alg_values_supported: {
    toKey: "requestObjectEncryptionAlgValuesSupported"
  },
  request_object_encryption_enc_values_supported: {
    toKey: "requestObjectEncryptionEncValuesSupported"
  },
  token_endpoint_auth_methods_supported: {
    toKey: "tokenEndpointAuthMethodsSupported"
  },
  token_endpoint_auth_signing_alg_values_supported: {
    toKey: "tokenEndpointAuthSigningAlgValuesSupported"
  },
  display_values_supported: { toKey: "displayValuesSupported" },
  claim_types_supported: { toKey: "claimTypesSupported" },
  claims_supported: { toKey: "claimsSupported" },
  service_documentation: { toKey: "serviceDocumentation" },
  claims_locales_supported: { toKey: "claimsLocalesSupported" },
  ui_locales_supported: { toKey: "uiLocalesSupported" },
  claims_parameter_supported: { toKey: "claimsParameterSupported" },
  request_parameter_supported: { toKey: "requestParameterSupported" },
  request_uri_parameter_supported: { toKey: "requestUriParameterSupported" },
  require_request_uri_registration: { toKey: "requireRequestUriRegistration" },
  op_policy_uri: {
    toKey: "opPolicyUri",
    convertToUrl: true
  },
  op_tos_uri: {
    toKey: "opTosUri",
    convertToUrl: true
  }
};
let IssuerConfigFetcher = class IssuerConfigFetcher {
  constructor(fetcher, storageUtility) {
    this.fetcher = fetcher;
    this.storageUtility = storageUtility;
  }
  getLocalStorageKey(issuer) {
    return `issuerConfig:${issuer.toString()}`;
  }
  processConfig(config) {
    const parsedConfig = {};
    Object.keys(config).forEach(key => {
      if (issuerConfigKeyMap[key]) {
        parsedConfig[issuerConfigKeyMap[key].toKey] = issuerConfigKeyMap[key]
          .convertToUrl
          ? new url_parse_1.default(config[key])
          : config[key];
      }
    });
    return parsedConfig;
  }
  async fetchConfig(issuer) {
    let issuerConfig;
    issuerConfig = await this.storageUtility.safeGet(
      this.getLocalStorageKey(issuer),
      {
        schema: issuerConfigSchema_1.default
      }
    );
    if (issuerConfig !== undefined) {
      return issuerConfig;
    }
    const wellKnownUrl = new url_parse_1.default(issuer.toString());
    wellKnownUrl.set("pathname", "/.well-known/openid-configuration");
    const issuerConfigRequestBody = await this.fetcher.fetch(wellKnownUrl);
    try {
      issuerConfig = this.processConfig(await issuerConfigRequestBody.json());
    } catch (err) {
      console.log(err);
      throw new ConfigurationError_1.default(
        `[${issuer.toString()}] has an invalid configuration: ${err.message}`
      );
    }
    await this.storageUtility.set(
      this.getLocalStorageKey(issuer),
      JSON.stringify(issuerConfig)
    );
    return issuerConfig;
  }
};
IssuerConfigFetcher = __decorate(
  [
    tsyringe_1.injectable(),
    __param(0, tsyringe_1.inject("fetcher")),
    __param(1, tsyringe_1.inject("storageUtility")),
    __metadata("design:paramtypes", [Object, Object])
  ],
  IssuerConfigFetcher
);
exports.default = IssuerConfigFetcher;
//# sourceMappingURL=IssuerConfigFetcher.js.map
