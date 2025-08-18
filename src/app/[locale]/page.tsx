interface Props {
  params: {
    locale: string;
  };
}

export default function LocalePage({ params }: Props) {
  return (
    <h1>Hello from {params.locale}</h1>
  );
}
