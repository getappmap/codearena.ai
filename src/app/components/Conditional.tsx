export default function Conditional({
  condition,
  children,
}: {
  condition: boolean;
  children: React.ReactNode;
}) {
  if (condition) {
    return <>{children}</>;
  } else {
    return <></>;
  }
}
