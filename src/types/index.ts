export interface ISA {
  element01: string; // Always "ISA"
  element02: string; // Security Information
  element03: string; // Interchange ID Qualifier for Sender
  element04: string; // Interchange ID for Sender
  element05: string; // Interchange ID Qualifier for Receiver
  element06: string; // Interchange ID for Receiver
  element07: string; // Date
  element08: string; // Time
  element09: string; // Control Standards Identifier
  element10: string; // Control Version Number
  element11: string; // Control Number
  element12: string; // Acknowledgment Requested
  element13: string; // Usage Indicator
}

export interface GS {
  element01: string; // Functional Identifier Code
  element02: string; // Application Sender's Code
  element03: string; // Application Receiver's Code
  element04: string; // Date
  element05: string; // Time
  element06: string; // Group Control Number
  element07: string; // Responsible Agency Code
  element08: string; // Version/Release/Industry Identifier Code
}

export interface ST {
  element01: string; // Transaction Set Identifier Code
  element02: string; // Transaction Set Control Number
  element03: string; // Version/Release/Industry Identifier Code
}

export interface BHT {
  element01: string; // Hierarchical Structure Code
  element02: string; // Transaction Set Identifier Code
  element03: string; // Reference Identification
  element04: string; // Date
  element05: string; // Time
}

export interface HL {
  element01: string; // Hierarchical ID Number
  element02: string | undefined; // Hierarchical Parent ID Number
  element03: string; // Hierarchical Level Code
  element04: string; // Hierarchical Child Code
}

export interface NM1 {
  element01: string; // Entity Identifier Code
  element02: string; // Entity Type Qualifier
  element03: string; // Last Name
  element04: string; // First Name
  element05: string; // Middle Name
  element06: string; // Name Suffix
  element07: string; // Identification Code Qualifier
  element08: string; // Identification Code
}

export interface TRN {
  element01: string; // Trace Type Code
  element02: string; // Reference Identification
  element03: string; // Originating Company Identifier
}

export interface DMG {
  element01: string; // Date Time Period Format Qualifier
  element02: string; // Date
}

export interface DTP {
  element01: string; // Date/Time Qualifier
  element02: string; // Date
  element03: string; // Time Period Format Qualifier
}

export interface EB {
  element01: string; // Benefit Status Code
  element02: string | undefined; // Eligibility or Benefit Information
}

export interface SE {
  element01: string; // Number of Included Segments
  element02: string; // Transaction Set Control Number
}

export interface GE {
  element01: string; // Number of Transaction Sets Included
  element02: string; // Group Control Number
}

export interface IEA {
  element01: string; // Number of Included Functional Groups
  element02: string; // Interchange Control Number
}

// Main interface to represent the complete transaction
export interface Transaction {
  ISA: ISA;
  GS: GS;
  ST: ST;
  BHT: BHT;
  HL: HL[];
  NM1: NM1[];
  TRN: TRN;
  DMG: DMG;
  DTP: DTP;
  EB: EB[];
  SE: SE;
  GE: GE;
  IEA: IEA;
}

export enum EDITags {
  ISA = 'ISA',
  GS = 'GS',
  ST = 'ST',
  BHT = 'BHT',
  HL = 'HL',
  NM1 = 'NM1',
  TRN = 'TRN',
  DMG = 'DMG',
  DTP = 'DTP',
  EB = 'EB',
  SE = 'SE',
  GE = 'GE',
  IEA = 'IEA',
}
