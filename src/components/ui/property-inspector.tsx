import { PropertyGroup } from "@/components/ui/property-group";
import { PropertyField } from "@/components/ui/property-field";
import { PropertyInput, PropertyInputProps } from "@/components/ui/property-input";
import { PropertySelect, PropertySelectProps } from "@/components/ui/property-select";
import { PropertySplineEditor, PropertySplineEditorProps } from "@/components/ui/property-spline";
import { cn } from "@/utils/utils";

type PropertyInspectorField = {
    id: string;
    type: "input"; 
    properties: PropertyInputProps;
} | {
    id: string;
    type: "select";
    properties: PropertySelectProps;
} | {
    id: string;
    type: "spline";
    properties: PropertySplineEditorProps;
}

type PropertyInspectorRow = {
    id: string;
    label: string;
    column?: boolean;
    fields: PropertyInspectorField[];
}

export type PropertyInspectorGroup = {
    id: string;
    rows: PropertyInspectorRow[];
}

const renderGroups = ({ id, rows }: PropertyInspectorGroup) => (
    <PropertyGroup key={id}>
        {rows.map(renderRows)}
    </PropertyGroup>
)

const renderRows = ({ id, label, fields, column }: PropertyInspectorRow) => (
    <PropertyField label={label} key={id} column={column}>
        {fields.map(renderField)}
    </PropertyField>
)

interface PropertyInspectorProps {
    groups: PropertyInspectorGroup[];
}

const renderField = ({ id, type, properties }: PropertyInspectorField) => {
    if (type === "input") {
        return <PropertyInput {...properties} key={id} />
    }

    if (type === "select") {
        return <PropertySelect {...properties} key={id} />
    }

    if (type === "spline") {
        return <PropertySplineEditor {...properties} key={id} />
    }

    return null;
}

export const PropertyInspector = ({ groups }: PropertyInspectorProps) => (
    <div className={cn("flex flex-col gap-2")}>
        {groups.map(renderGroups)}
    </div>
)
