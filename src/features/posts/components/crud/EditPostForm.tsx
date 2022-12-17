import * as z from "zod";

import { Form, InputField, TextAreaField } from "components/Form";
import { Button, ConfirmationDialog } from "components/Elements";

import { Post } from "../../types";
import { EditPostDTO, useEditPost } from "../../api/editPost";

const EditPostSchema = z.object({
  title: z.string().min(1, "Required").max(100, "Maximum of 100 characters"),
  text: z.string().min(1, "Required").max(5000, "Maximum of 5000 characters"),
});

type EditPostFormProps = {
  post: Post;
  onSuccess: () => void;
  onCancel: () => void;
};

export const EditPostForm = ({
  post,
  onSuccess,
  onCancel,
}: EditPostFormProps) => {
  const editPostMutation = useEditPost();

  return (
    <div>
      <Form<EditPostDTO, typeof EditPostSchema>
        onSubmit={async (values) => {
          await editPostMutation.mutateAsync({
            ...values,
            postId: post.id,
          });
          onSuccess();
        }}
        schema={EditPostSchema}
      >
        {({ register, formState }) => (
          <>
            <InputField
              type="text"
              className="hover:cursor-not-allowed"
              disabled={true}
              label="Title"
              error={formState.errors["title"]}
              registration={register("title", {
                value: post.title,
              })}
            />
            <TextAreaField
              label="Body"
              className="h-72"
              error={formState.errors["text"]}
              registration={register("text", { value: post.text })}
            />
            <div>
              <Button
                type="submit"
                className="w-full"
                isLoading={editPostMutation.isLoading}
              >
                Update Post
              </Button>

              <ConfirmationDialog
                triggerButton={
                  <Button className="mt-2 w-full" variant="danger">
                    Discard Changes
                  </Button>
                }
                confirmButton={
                  <Button variant="danger" onClick={onCancel}>
                    Discard
                  </Button>
                }
                title="Are you sure you want to discard your changes?"
              />
            </div>
          </>
        )}
      </Form>
    </div>
  );
};
