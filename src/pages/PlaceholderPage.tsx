type PlaceholderPageProps = {
    title: string;
    description: string;
};

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                <p className="text-muted-foreground">{description}</p>
            </div>
            <div className="rounded-lg border p-6">
                <p className="text-muted-foreground">{title} 화면 콘텐츠가 여기에 표시됩니다.</p>
            </div>
        </div>
    );
}
