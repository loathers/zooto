import {
  Select as ChakraSelect,
  ConditionalValue,
  ListCollection,
  Portal,
} from "@chakra-ui/react";

type Props = {
  size?: ConditionalValue<"xs" | "sm" | "md" | "lg" | undefined>;
  collection: ListCollection;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  "data-group-item"?: "";
  "data-first"?: "";
  "data-between"?: "";
  "data-last"?: "";
};

export function Select({
  size,
  value,
  onChange,
  collection,
  placeholder,
  ...props
}: Props) {
  const groupProps = props["data-group-item"] !== undefined && {
    ...(props["data-first"] !== undefined && {
      borderStartEndRadius: "0 !important",
      borderEndEndRadius: "0 !important",
      marginInlineEnd: "-1px",
      borderEndWidth: "0",
    }),
    ...(props["data-between"] !== undefined && {
      borderRadius: "0 !important",
      marginInlineEnd: "-1px",
      borderEndWidth: "0",
    }),
    ...(props["data-last"] !== undefined && {
      borderStartStartRadius: "0 !important",
      borderEndStartRadius: "0 !important",
    }),
  };

  return (
    <ChakraSelect.Root
      size={size}
      collection={collection}
      value={[value]}
      onValueChange={(e) => onChange(e.value[0])}
    >
      <ChakraSelect.Trigger {...groupProps}>
        <ChakraSelect.ValueText placeholder={placeholder} />
      </ChakraSelect.Trigger>
      <Portal>
        <ChakraSelect.Positioner>
          <ChakraSelect.Content>
            {collection.items.map((item) => (
              <ChakraSelect.Item key={item[0]} item={item}>
                {item[1]}
              </ChakraSelect.Item>
            ))}
          </ChakraSelect.Content>
        </ChakraSelect.Positioner>
      </Portal>
    </ChakraSelect.Root>
  );
}
