import {
  BHT,
  DMG,
  DTP,
  EDITags,
  GE,
  GS,
  IEA,
  ISA,
  SE,
  ST,
  Transaction,
  TRN,
} from '../types';

export function removeSpaces(input: string): string {
  return input.replace(/\s+/g, '');
}

export function extractEDITags(input: string): string[] {
  const segments = input.split('~').filter(segment => segment !== '');
  const tags: string[] = [];
  for (const segment of segments) {
    const elements = segment.split('*');
    tags.push(elements[0]);
  }
  return tags;
}

export function validateSegments(input: string): void {
  const segments = input.split('~').filter(segment => segment !== '');
  for (const segment of segments) {
    const startTag = segment.split('*')[0] as EDITags;

    if (startTag.length > 0) {
      const requiredFields = Object.values(EDITags);
      if (!requiredFields.includes(startTag))
        throw new Error(`Incorrect tag on segment: '${segment}'`);
    } else {
      throw new Error(`Missing tag on segment: '${segment}'`);
    }
  }
}

export function parseTransactionString(input: string): Transaction | null {
  const segments = input.split('~').filter(segment => segment !== '');

  const transaction: Transaction = {
    ISA: {} as ISA,
    GS: {} as GS,
    ST: {} as ST,
    BHT: {} as BHT,
    HL: [],
    NM1: [],
    TRN: {} as TRN,
    DMG: {} as DMG,
    DTP: {} as DTP,
    EB: [],
    SE: {} as SE,
    GE: {} as GE,
    IEA: {} as IEA,
  };

  for (const segment of segments) {
    const elements = segment.split('*');

    switch (elements[0]) {
      case 'ISA':
        transaction.ISA = {
          element01: elements[0],
          element02: elements[1],
          element03: elements[2],
          element04: elements[3],
          element05: elements[4],
          element06: elements[5],
          element07: elements[6],
          element08: elements[7],
          element09: elements[8],
          element10: elements[9],
          element11: elements[10],
          element12: elements[11],
          element13: elements[12],
        };
        break;

      case 'GS':
        transaction.GS = {
          element01: elements[0],
          element02: elements[1],
          element03: elements[2],
          element04: elements[3],
          element05: elements[4],
          element06: elements[5],
          element07: elements[6],
          element08: elements[7],
        };
        break;

      case 'ST':
        transaction.ST = {
          element01: elements[0],
          element02: elements[1],
          element03: elements[2],
        };
        break;

      case 'BHT':
        transaction.BHT = {
          element01: elements[0],
          element02: elements[1],
          element03: elements[2],
          element04: elements[3],
          element05: elements[4],
        };
        break;

      case 'HL':
        transaction.HL.push({
          element01: elements[1],
          element02: elements[2] || undefined, // Optional
          element03: elements[3],
          element04: elements[4],
        });
        break;

      case 'NM1':
        transaction.NM1.push({
          element01: elements[1],
          element02: elements[2],
          element03: elements[3],
          element04: elements[4],
          element05: elements[5],
          element06: elements[6],
          element07: elements[7],
          element08: elements[8],
        });
        break;

      case 'TRN':
        transaction.TRN = {
          element01: elements[1],
          element02: elements[2],
          element03: elements[3],
        };
        break;

      case 'DMG':
        transaction.DMG = {
          element01: elements[1],
          element02: elements[2],
        };
        break;

      case 'DTP':
        transaction.DTP = {
          element01: elements[1],
          element02: elements[2],
          element03: elements[3],
        };
        break;

      case 'EB':
        transaction.EB.push({
          element01: elements[1],
          element02: elements[2] || undefined, // Optional
        });
        break;

      case 'SE':
        transaction.SE = {
          element01: elements[1],
          element02: elements[2],
        };
        break;

      case 'GE':
        transaction.GE = {
          element01: elements[1],
          element02: elements[2],
        };
        break;

      case 'IEA':
        transaction.IEA = {
          element01: elements[1],
          element02: elements[2],
        };
        break;

      default:
        // Unknown segment type
        break;
    }
  }

  return transaction;
}

export function checkForRequiredFields(
  requiredFields: string[],
  parsed: string[]
): void {
  const missingFields = requiredFields.filter(field => !parsed.includes(field));

  if (missingFields.length > 0) {
    throw new Error(`Missing required field(s): '${[...missingFields]}'`);
  }
}
