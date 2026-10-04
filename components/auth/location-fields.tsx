'use client';

import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import api from '@/app/lib/api';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { flagEmoji } from '@/lib/properties/filters';
import { useCountries } from '@/lib/properties/queries';
import { cn } from '@/lib/utils';

interface Option {
  id: number;
  name: string;
  code?: string;
}

const MAX_VISIBLE = 80;

/** Searchable select. Filtering is done here (not by cmdk) so lists with thousands of cities stay fast. */
function Combobox({
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  disabled,
  invalid,
}: {
  options: Option[];
  value: number | undefined;
  onChange: (id: number) => void;
  placeholder: string;
  searchPlaceholder: string;
  disabled?: boolean;
  invalid?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const selected = options.find((o) => o.id === value);
  const visible = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return (q ? options.filter((o) => o.name.toLowerCase().includes(q)) : options).slice(0, MAX_VISIBLE);
  }, [options, search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-invalid={invalid}
            disabled={disabled}
            className={cn('h-9 w-full justify-between font-normal', !selected && 'text-muted-foreground')}
          >
            <span className="truncate">
              {selected ? (
                <>
                  {selected.code && (
                    <span aria-hidden className="mr-2">
                      {flagEmoji(selected.code)}
                    </span>
                  )}
                  {selected.name}
                </>
              ) : (
                placeholder
              )}
            </span>
            <ChevronsUpDown className="size-4 shrink-0 opacity-50" aria-hidden />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-(--radix-popover-trigger-width) min-w-64 p-0">
        <Command shouldFilter={false}>
          <CommandInput placeholder={searchPlaceholder} value={search} onValueChange={setSearch} />
          <CommandList className="max-h-60">
            <CommandEmpty>Nothing matches that name.</CommandEmpty>
            <CommandGroup>
              {visible.map((o) => (
                <CommandItem
                  key={o.id}
                  value={String(o.id)}
                  onSelect={() => {
                    onChange(o.id);
                    setOpen(false);
                    setSearch('');
                  }}
                >
                  {o.code && (
                    <span aria-hidden className="w-6">
                      {flagEmoji(o.code)}
                    </span>
                  )}
                  {o.name}
                  <Check className={cn('ml-auto size-4', o.id === value ? 'opacity-100' : 'opacity-0')} aria-hidden />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

const list = async (url: string): Promise<Option[]> => {
  const { data } = await api.get<Option[]>(url);
  return Array.isArray(data) ? [...data].sort((a, b) => a.name.localeCompare(b.name)) : [];
};

/**
 * Country → state/region (when the country has any) → city.
 * The form must have optional number fields `countryId`, `stateId` and `cityId`.
 */
export function LocationFields<T extends FieldValues>({ form }: { form: UseFormReturn<T> }) {
  const name = (k: 'countryId' | 'stateId' | 'cityId') => k as Path<T>;
  const countryId = form.watch(name('countryId')) as number | undefined;
  const stateId = form.watch(name('stateId')) as number | undefined;
  const set = (k: 'countryId' | 'stateId' | 'cityId', v: number | undefined) =>
    form.setValue(name(k), v as never, { shouldValidate: v !== undefined, shouldDirty: true });

  const countries = useCountries();
  const states = useQuery({
    queryKey: ['states', countryId],
    enabled: !!countryId,
    staleTime: Infinity,
    queryFn: () => list(`/states/retrieve/get-all/${countryId}`),
  });
  const hasStates = (states.data?.length ?? 0) > 0;
  const cities = useQuery({
    queryKey: ['cities', countryId, hasStates ? stateId : 'all'],
    enabled: !!countryId && states.isFetched && (!hasStates || !!stateId),
    staleTime: Infinity,
    queryFn: () => list(hasStates ? `/cities/retrieve/get-all-by-state/${stateId}` : `/cities/retrieve/get-all-by-country/${countryId}`),
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField
        control={form.control}
        name={name('countryId')}
        render={({ field, fieldState }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel>Country</FormLabel>
            <Combobox
              options={(countries.data ?? []).map((c) => ({ id: c.id, name: c.name, code: c.code }))}
              value={field.value as number | undefined}
              onChange={(id) => {
                set('countryId', id);
                set('stateId', undefined);
                set('cityId', undefined);
              }}
              placeholder={countries.isLoading ? 'Loading countries' : 'Choose a country'}
              searchPlaceholder="Find a country"
              disabled={countries.isLoading}
              invalid={!!fieldState.error}
            />
            <FormMessage />
          </FormItem>
        )}
      />
      {hasStates && (
        <FormField
          control={form.control}
          name={name('stateId')}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>State or region</FormLabel>
              <Combobox
                options={states.data ?? []}
                value={field.value as number | undefined}
                onChange={(id) => {
                  set('stateId', id);
                  set('cityId', undefined);
                }}
                placeholder="Choose a region"
                searchPlaceholder="Find a region"
                invalid={!!fieldState.error}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      <FormField
        control={form.control}
        name={name('cityId')}
        render={({ field, fieldState }) => (
          <FormItem className={hasStates ? undefined : 'sm:col-span-2'}>
            <FormLabel>City</FormLabel>
            <Combobox
              options={cities.data ?? []}
              value={field.value as number | undefined}
              onChange={(id) => set('cityId', id)}
              placeholder={!countryId ? 'Choose a country first' : hasStates && !stateId ? 'Choose a region first' : cities.isLoading ? 'Loading cities' : 'Choose a city'}
              searchPlaceholder="Find a city"
              disabled={!cities.data?.length}
              invalid={!!fieldState.error}
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
