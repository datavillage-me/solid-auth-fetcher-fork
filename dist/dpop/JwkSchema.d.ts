declare const jwkSchema: {
  description: string;
  type: string;
  required: string[];
  properties: {
    kty: {
      type: string;
    };
    e: {
      type: string;
    };
    n: {
      type: string;
    };
  };
};
export default jwkSchema;
