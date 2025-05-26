type LiteralField = {
  type: "literal";
  value: string;
  "xml:lang"?: string;
};

type ProcessingRegisterDetailItem = {
  id: LiteralField;
  description: LiteralField;
  processor: LiteralField;
  type: LiteralField;
  name: LiteralField;
  personalDataDescription: LiteralField;
  personalData: LiteralField;
  sensitivePersonalData: LiteralField;
  formal_framework: LiteralField;
  formal_framework_clarification: LiteralField;
  grantees: LiteralField;
  storagePeriod: LiteralField;
};
