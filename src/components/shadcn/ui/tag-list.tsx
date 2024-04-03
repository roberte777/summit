import React from "react";
import { type Tag as TagType } from "./tag-input";
import { Tag, type TagProps } from "./tag";
import { cn } from "~/utils/shadcn";
import SortableList, { SortableItem } from "react-easy-sort";

export type TagListProps = {
  tags: TagType[];
  customTagRenderer?: (tag: TagType) => React.ReactNode;
  direction?: TagProps["direction"];
  onSortEnd: (oldIndex: number, newIndex: number) => void;
} & Omit<TagProps, "tagObj">;

const DropTarget: React.FC = () => {
  return <div className={cn("bg-secondary/50 h-full rounded-md")} />;
};

export const TagList: React.FC<TagListProps> = ({
  tags,
  customTagRenderer,
  direction,
  draggable,
  onSortEnd,
  ...tagListProps
}) => {
  const [draggedTagId, setDraggedTagId] = React.useState<string | null>(null);

  const handleMouseDown = (id: string) => {
    setDraggedTagId(id);
  };

  const handleMouseUp = () => {
    setDraggedTagId(null);
  };

  return (
    <div
      className={cn("max-w-[450px] rounded-md", {
        "flex flex-wrap gap-2": direction === "row",
        "flex flex-col gap-2": direction === "column",
      })}
    >
      {draggable ? (
        <SortableList
          onSortEnd={onSortEnd}
          className="list flex flex-wrap gap-2"
          dropTarget={<DropTarget />}
        >
          {tags.map((tagObj) => (
            <SortableItem key={tagObj.id}>
              <div
                onMouseDown={() => handleMouseDown(tagObj.id)}
                onMouseLeave={handleMouseUp}
                className={cn(
                  {
                    "border-primary rounded-md border border-solid":
                      draggedTagId === tagObj.id,
                  },
                  "transition-all duration-200 ease-in-out",
                )}
              >
                {customTagRenderer ? (
                  customTagRenderer(tagObj)
                ) : (
                  <Tag
                    draggable={undefined}
                    direction={undefined}
                    tagObj={tagObj}
                    {...tagListProps}
                  />
                )}
              </div>
            </SortableItem>
          ))}
        </SortableList>
      ) : (
        tags.map((tagObj) =>
          customTagRenderer ? (
            customTagRenderer(tagObj)
          ) : (
            <Tag
              draggable={undefined}
              direction={undefined}
              key={tagObj.id}
              tagObj={tagObj}
              {...tagListProps}
            />
          ),
        )
      )}
    </div>
  );
};
