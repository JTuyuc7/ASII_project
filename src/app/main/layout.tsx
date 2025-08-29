export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        // backgroundColor: 'orange',
        minHeight: '100%',
      }}
    >
      {/* <Header /> */}
      {children}
    </div>
  );
}
