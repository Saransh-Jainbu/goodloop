// OWNER: Samaksh. Contract: getRegistrationsForEvent(eventId), getMyRegistrations().
export type RegistrationWithUser = { id: string; userName: string | null; userEmail: string; createdAt: Date };

export async function getRegistrationsForEvent(_eventId: string): Promise<RegistrationWithUser[]> {
  return []; // TODO
}

export async function getMyRegistrations() {
  return []; // TODO
}
