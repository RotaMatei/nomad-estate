'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSavedForUser, savePropertyForUser, unsavePropertyForUser } from '@/app/lib/propertyApi';
import { useSession } from '@/hooks/use-session';

/** Saved ("liked") properties of the signed-in investor, with an optimistic toggle. */
export function useSavedProperties() {
  const { session } = useSession();
  const userId = session && !session.isAgency ? session.id : null;
  const client = useQueryClient();
  const key = ['saved', userId] as const;

  const query = useQuery({
    queryKey: key,
    enabled: !!userId,
    queryFn: async () => (await getSavedForUser(userId!)).map((s) => s.propertyId),
  });

  const toggle = useMutation({
    mutationFn: async ({ id, save }: { id: string; save: boolean }) => {
      const ok = save ? await savePropertyForUser(userId!, id) : await unsavePropertyForUser(userId!, id);
      if (!ok) throw new Error(save ? 'Could not save this property' : 'Could not remove this property');
    },
    onMutate: async ({ id, save }) => {
      await client.cancelQueries({ queryKey: key });
      const previous = client.getQueryData<string[]>(key) ?? [];
      client.setQueryData<string[]>(key, save ? [...previous, id] : previous.filter((x) => x !== id));
      return { previous };
    },
    onError: (_e, _v, ctx) => client.setQueryData(key, ctx?.previous),
    onSettled: () => client.invalidateQueries({ queryKey: key }),
  });

  return {
    canSave: !!userId,
    isAgency: !!session?.isAgency,
    savedIds: query.data ?? [],
    toggle: toggle.mutateAsync,
  };
}
