import { Markdown } from "~/components/ui/Markdown";
import { format } from "date-fns";
import { AvatarENS, NameENS } from "~/components/ENS";
import {
  ErrorMessage,
  Form,
  FormControl,
  Textarea,
} from "~/components/ui/Form";
import { CommentSchema } from "~/features/comments/types";
import { Button } from "~/components/ui/Button";
import { api } from "~/utils/api";

export function ProjectComments({ projectId = "" }) {
  const utils = api.useUtils();
  const comment = api.comments.create.useMutation({
    async onSuccess() {
      utils.comments.list.invalidate().catch();
    },
  });
  const { data: comments } = api.comments.list.useQuery({ projectId });
  return (
    <section>
      <h3 className="text-xl font-semibold">Comments</h3>

      <ol className="mb-8 flex flex-col gap-8 divide-y dark:divide-gray-800">
        {comments?.map((comment) => (
          <li key={comment.id} className="flex gap-2 pt-8">
            <AvatarENS size="sm" address={comment.creatorId} />
            <div>
              <div className="flex gap-2 text-sm">
                <NameENS address={comment.creatorId} /> at
                <div suppressHydrationWarning>
                  {format(comment.createdAt, "PPP HH:mm")}
                </div>
              </div>
              <Markdown className="prose-sm">{comment.content}</Markdown>
            </div>
          </li>
        ))}
      </ol>

      <Form
        defaultValues={{ projectId }}
        schema={CommentSchema}
        onSubmit={(values, form) => {
          comment.mutate(values, { onSuccess: () => form.reset({}) });
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
