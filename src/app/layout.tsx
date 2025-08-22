import { ReactNode } from 'react';

// Even though this component is just passing its children through, the metadata
// interface requires this interface declaration.
export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
