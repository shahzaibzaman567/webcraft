import { Schema, model } from 'mongoose';

export interface VaultMetaRecord {
  _id: string;
  statsDate: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const vaultMetaSchema = new Schema<VaultMetaRecord>(
  {
    _id: { type: String, required: true },
    statsDate: { type: String, required: true },
  },
  { timestamps: true, collection: 'vault_meta', versionKey: false },
);

export const VaultMeta = model<VaultMetaRecord>('VaultMeta', vaultMetaSchema);
