import { Menu, Portal } from "@chakra-ui/react";

type Props = {
  options?: [value: string, label: string][];
  value: string;
  onChange: (value: string) => void;
};

export function FamiliarTableSortByModifier({
  options = [],
  value,
  onChange,
}: Props) {
  return (
    <>
      <Menu.Root>
        <Menu.Trigger asChild></Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.RadioItemGroup
                value={value}
                onValueChange={(e) => onChange(e.value)}
              >
                {options.map(([v, label]) => (
                  <Menu.RadioItem key={v} value={v}>
                    {label}
                  </Menu.RadioItem>
                ))}
              </Menu.RadioItemGroup>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </>
  );
}
