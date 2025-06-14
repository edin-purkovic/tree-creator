
export const StatsField = ({ label, count }: { label: string; count: number }) => (
    <div className="flex gap-2 p-2 text-color-default">
        <div>{label}</div>
        <div>{count}</div>
    </div>
)
