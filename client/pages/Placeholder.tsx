import AppLayout from "@/components/layout/AppLayout";

export default function Placeholder({ title }: { title: string }) {
  return (
    <AppLayout>
      <div className="text-center py-24">
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-2">
          This page will be generated next. Ask to fill it in and wire up
          Firebase forms and uploads.
        </p>
      </div>
    </AppLayout>
  );
}
