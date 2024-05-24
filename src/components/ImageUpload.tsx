import { SignerOrProvider } from "@ethereum-attestation-service/eas-sdk/dist/transaction";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { ImageIcon } from "lucide-react";
import { type ComponentProps, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { IconButton } from "~/components/ui/Button";
import { Spinner } from "~/components/ui/Spinner";
import { useUploadMetadata } from "~/hooks/useMetadata";

type Props = { name?: string; maxSize?: number } & ComponentProps<"img">;

export function ImageUpload({
  name,
  maxSize = 1024 * 1024, // 1 MB
  className,
}: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const { control } = useFormContext();

  const upload = useUploadMetadata();
  const select = useMutation({
    mutationFn: async (file: File) => {
      if (file?.size >= maxSize) {
        toast.error("Image too large", {
          description: `The image to selected is: ${(file.size / 1024).toFixed(
            2,
          )} / ${(maxSize / 1024).toFixed(2)} kb`,
        });
        throw new Error("IMAGE_TOO_LARGE");
      }

      return URL.createObjectURL(file);
    },
  });

  return (
    <Controller
      control={control}
      name={name!}
      rules={{ required: "Recipe picture is required" }}
      render={({ field: { value, onChange, ...field } }) => {
        return (
          <div className={clsx("relative overflow-hidden", className)}>
            <IconButton
              disabled={upload.isPending}
              onClick={() => ref.current?.click()}
              icon={upload.isPending ? Spinner : ImageIcon}
              className="absolute bottom-1 right-1"
            ></IconButton>

            <div
              className={clsx(
                "h-full rounded-xl bg-gray-200 bg-cover bg-center bg-no-repeat dark:bg-gray-800",
                {
                  ["animate-pulse opacity-50"]: upload.isPending,
                },
              )}
              style={{
                backgroundImage: `url("${select.data ?? value}")`,
              }}
            />
            <input
              {...field}
              ref={ref}
              className="hidden"
              accept="image/png, image/jpeg"
              // value={value?.[name]}
              onChange={(event) => {
                const [file] = event.target.files ?? [];
                if (file) {
                  select.mutate(file, {
                    onSuccess: () => {
                      upload.mutate(file, {
                        onSuccess: (data) => {
                          onChange(data.url);
                        },
                      });
                    },
                  });
                }
              }}
              type="file"
            />
          </div>
        );
      }}
    />
  );
}
