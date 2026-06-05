type DemoSafetyRecord = {
  is_demo?: boolean | null;
  archived_at?: string | null;
  deleted_at?: string | null;
};

type Payload = Record<string, unknown>;

export function isRealOperationalRecord(record: DemoSafetyRecord | null | undefined) {
  if (!record) {
    return false;
  }

  return !record.is_demo && !record.archived_at && !record.deleted_at;
}

export function filterRealOperationalRecords<T extends DemoSafetyRecord>(
  records: T[],
) {
  return records.filter(isRealOperationalRecord);
}

export function filterDemoRecords<T extends DemoSafetyRecord>(records: T[]) {
  return records.filter((record) => Boolean(record.is_demo));
}

export function markAsDemoPayload<T extends Payload>(payload: T) {
  return {
    ...payload,
    is_demo: true,
  };
}

export function markAsArchivedPayload() {
  return {
    archived_at: new Date().toISOString(),
  };
}

export function markAsDeletedPayload() {
  return {
    deleted_at: new Date().toISOString(),
  };
}
