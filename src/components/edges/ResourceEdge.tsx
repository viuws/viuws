import {
    BaseEdge,
    BezierEdgeProps,
    BezierPathOptions,
    EdgeLabelRenderer,
    getBezierPath,
} from "reactflow";

import { ResourceEdgeData } from "../../model/edges/ResourceEdge";

export default function ResourceEdge({
    id,
    // animated,
    data,
    style,
    // selected,
    // source,
    // target,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    // sourceHandleId,
    // targetHandleId,
    interactionWidth,
    label,
    labelStyle,
    labelShowBg,
    labelBgStyle,
    labelBgPadding,
    labelBgBorderRadius,
    markerStart,
    markerEnd,
    pathOptions,
}: BezierEdgeProps<ResourceEdgeData>) {
    const [path, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        curvature: (pathOptions as BezierPathOptions | undefined)?.curvature,
    });
    return (
        <>
            <BaseEdge
                id={id}
                path={path}
                labelX={labelX}
                labelY={labelY}
                label={label}
                labelStyle={labelStyle}
                labelShowBg={labelShowBg}
                labelBgStyle={labelBgStyle}
                labelBgPadding={labelBgPadding}
                labelBgBorderRadius={labelBgBorderRadius}
                style={style}
                markerEnd={markerEnd}
                markerStart={markerStart}
                interactionWidth={interactionWidth}
            />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: "absolute",
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        pointerEvents: "all",
                    }}
                    className="nodrag nopan"
                >
                    {data?.resource}
                </div>
            </EdgeLabelRenderer>
        </>
    );
}
