import { ColorPaletteDemo } from "@/components/ColorPaletteDemo";
import { ECommerceExample } from "@/components/ECommerceExample";
import { ThemeTest } from "@/components/ThemeTest";
import { Stack, Divider } from "@mantine/core";

export default function Home() {
  return (
    <Stack gap="xl">
      <ThemeTest />
      <Divider size="sm" />
      <ColorPaletteDemo />
      <Divider size="sm" />
      <ECommerceExample />
    </Stack>
  );
}
