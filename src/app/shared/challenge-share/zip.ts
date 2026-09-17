/**
 * Gerador de .zip mínimo (método "store", sem compressão).
 *
 * É o suficiente para empacotar os cards: PNG já vem comprimido, então deflate
 * não economizaria quase nada — e assim o projeto não ganha uma dependência só
 * para juntar arquivos.
 */

/**
 * Bytes garantidamente sobre um `ArrayBuffer` (e não um `SharedArrayBuffer`),
 * que é o que o `Blob` aceita como parte.
 */
export type ZipBytes = Uint8Array<ArrayBuffer>;

export interface ZipEntry {
  /** Caminho dentro do zip, com `/` para subpastas. */
  name: string;
  data: ZipBytes;
}

const CRC_TABLE = buildCrcTable();

export function createZip(entries: ZipEntry[], modifiedAt: Date = new Date()): Blob {
  const encoder = new TextEncoder();
  const { time, date } = toDosDateTime(modifiedAt);

  const localParts: ZipBytes[] = [];
  const centralParts: ZipBytes[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = encoder.encode(entry.name);
    const crc = crc32(entry.data);
    const size = entry.data.length;

    const local = new Uint8Array(30 + nameBytes.length);
    const localView = new DataView(local.buffer);
    localView.setUint32(0, 0x04034b50, true); // assinatura do cabeçalho local
    localView.setUint16(4, 20, true); // versão necessária
    localView.setUint16(6, 0x0800, true); // flag: nome em UTF-8
    localView.setUint16(8, 0, true); // método: store
    localView.setUint16(10, time, true);
    localView.setUint16(12, date, true);
    localView.setUint32(14, crc, true);
    localView.setUint32(18, size, true);
    localView.setUint32(22, size, true);
    localView.setUint16(26, nameBytes.length, true);
    localView.setUint16(28, 0, true); // sem campo extra
    local.set(nameBytes, 30);

    localParts.push(local, entry.data);

    const central = new Uint8Array(46 + nameBytes.length);
    const centralView = new DataView(central.buffer);
    centralView.setUint32(0, 0x02014b50, true); // assinatura do diretório central
    centralView.setUint16(4, 20, true); // versão que gerou
    centralView.setUint16(6, 20, true); // versão necessária
    centralView.setUint16(8, 0x0800, true);
    centralView.setUint16(10, 0, true);
    centralView.setUint16(12, time, true);
    centralView.setUint16(14, date, true);
    centralView.setUint32(16, crc, true);
    centralView.setUint32(20, size, true);
    centralView.setUint32(24, size, true);
    centralView.setUint16(28, nameBytes.length, true);
    centralView.setUint32(42, offset, true); // onde começa o cabeçalho local
    central.set(nameBytes, 46);

    centralParts.push(central);
    offset += local.length + size;
  }

  const centralSize = centralParts.reduce((total, part) => total + part.length, 0);

  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true); // fim do diretório central
  endView.setUint16(8, entries.length, true);
  endView.setUint16(10, entries.length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, offset, true);

  return new Blob([...localParts, ...centralParts, end], { type: 'application/zip' });
}

function crc32(data: ZipBytes): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = CRC_TABLE[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function buildCrcTable(): Uint32Array {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let value = i;
    for (let bit = 0; bit < 8; bit++) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[i] = value >>> 0;
  }
  return table;
}

/** Data/hora no formato MS-DOS que o zip usa desde 1989. */
function toDosDateTime(value: Date): { time: number; date: number } {
  return {
    time: (value.getHours() << 11) | (value.getMinutes() << 5) | (value.getSeconds() >> 1),
    date: ((value.getFullYear() - 1980) << 9) | ((value.getMonth() + 1) << 5) | value.getDate()
  };
}
