import { Checkmark, IconButton, Menu, Portal } from "@chakra-ui/react";
import { LuTableProperties } from "react-icons/lu";

type Props = {
  headers: Record<string, string>;
  value: Record<string, boolean>;
  onChange: (value: Record<string, boolean>) => void;
};

export function FamiliarTableColumnVisibility({
  headers,
  value,
  onChange,
}: Props) {
  return (
    <Menu.Root
      onSelect={({ value: v }) => onChange({ ...value, [v]: !value[v] })}
    >
      <Menu.Trigger asChild>
        <IconButton variant="outline" size="2xs" title="Column visibility">
          <LuTableProperties />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {Object.entries(value).map(([id, visible]) => (
              <Menu.Item key={id} value={id} cursor="pointer">
                <Checkmark checked={visible} /> {headers[id] ?? id}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
