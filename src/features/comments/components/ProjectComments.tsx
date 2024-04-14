import { Markdown } from "~/components/ui/Markdown";
import { format } from "date-fns";
import { AvatarENS, NameENS } from "~/components/ENS";
import {
  ErrorMessage,
  Form,
  FormControl,
  Textarea,
} from "~/components/ui/Form";
import { CommentSchema, CommentUpdateSchema } from "~/features/comments/types";
import { Button } from "~/components/ui/Button";
import { api } from "~/utils/api";
import { Ellipsis } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { createComponent } from "~/components/ui";
import { tv } from "tailwind-variants";
import { useAccount } from "wagmi";
import { useState } from "react";

export function ProjectComments({ projectId = "" }) {
  const { address } = useAccount();
  const [isEditing, setEditing] = useState<string | null>(null);
  const utils = api.useUtils();
  const onSuccess = async () => utils.comments.list.invalidate();
  const remove = api.comments.delete.useMutation({ onSuccess });
  const update = api.comments.update.useMutation({
    async onSuccess() {
      setEditing(null);
      return onSuccess();
    },
  });
  const comment = api.comments.create.useMutation({ onSuccess });
  const { data: comments } = api.comments.list.useQuery({ projectId });
  return (
    <section>
      <h3 className="text-xl font-semibold">Comments</h3>

      <ol className="mb-8 flex flex-col gap-8 divide-y dark:divide-gray-800">
        {comments?.map(({ id, content, creatorId, createdAt }) => (
          <li key={id} className="flex gap-2 pt-8">
            <AvatarENS size="sm" address={creatorId} />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex gap-2 text-sm">
                  <NameENS address={creatorId} /> at
                  <div suppressHydrationWarning>
                    {format(createdAt, "PPP HH:mm")}
                  </div>
                </div>
                {address === creatorId && (
                  <CommentActionsDropdown
                    onEdit={() => setEditing(id)}
                    onDelete={() => remove.mutate({ id })}
                  />
                )}
              </div>
              {isEditing === id ? (
                <Form
                  defaultValues={{ id, content }}
                  schema={CommentUpdateSchema}
                  onSubmit={(values) => update.mutate(values)}
                >
                  <FormControl name="content">
                    <Textarea autoFocus />
                  </FormControl>
                  <div className="flex items-center justify-end">
                    <div className="flex gap-2">
                      <Button onClick={() => setEditing(null)}>Cancel</Button>
                      <Button
                        variant="primary"
                        type="submit"
                        isLoading={update.isPending}
                      >
                        Update comment
                      </Button>
                    </div>
                  </div>
                </Form>
              ) : (
                <Markdown className="prose-sm">{content}</Markdown>
              )}
            </div>
          </li>
        ))}
      </ol>

      <Form
        defaultValues={{ projectId }}
        schema={CommentSchema}
        onSubmit={(values, form) => {
          comment.mutate(values, {
            onSuccess: () => form.reset({ content: "" }),
          });
        }}
      >
        <FormControl name="content" label="Add a comment">
          <Textarea
            disabled={comment.isPending}
            rows={6}
            placeholder="Add your comment here..."
          />
        </FormControl>
        <div className="flex items-center justify-between">
          <div className="text-gray-600">Markdown is supported</div>
          <Button variant="primary" type="submit" isLoading={comment.isPending}>
            Comment
          </Button>
        </div>
        <ErrorMessage>{comment.error?.message}</ErrorMessage>
      </Form>
    </section>
  );
}

function CommentActionsDropdown({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button icon={Ellipsis} size="icon" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 rounded border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          sideOffset={5}
        >
          <DropdownItem onClick={onEdit}>Edit</DropdownItem>
          <DropdownItem onClick={onDelete}>Delete</DropdownItem>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

const DropdownItem = createComponent(
  DropdownMenu.Item,
  tv({
    base: "cursor-pointer rounded py-3 px-4 text-sm text-gray-900 outline-none hover:bg-gray-100 focus-visible:ring-0 dark:text-gray-300 dark:hover:bg-gray-800",
  }),
);
