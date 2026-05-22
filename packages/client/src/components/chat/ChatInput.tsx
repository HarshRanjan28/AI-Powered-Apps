import { FaArrowUp } from 'react-icons/fa';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';

export type ChatFormData = {
  prompt: string;
};

type Props = {
  onSubmit: (data: ChatFormData) => void;
};

export default function ChatInput({ onSubmit }: Props) {
  const { register, handleSubmit, reset, formState } = useForm<ChatFormData>();
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };
  const submit = handleSubmit((data) => {
    reset({ prompt: '' });
    onSubmit(data);
  });
  return (
    <form
      className="flex flex-col gap-2 items-end border-2 rounded-3xl p-4"
      onSubmit={submit}
      onKeyDown={handleKeyDown}
    >
      <textarea
        {...register('prompt', {
          required: true,
          validate: (data) => data.trim().length > 0,
        })}
        autoFocus
        className="w-full border-0 focus:outline-0 resize-none"
        placeholder="Ask anything"
        maxLength={1000}
      />
      <Button disabled={!formState.isValid} className="rounded-full w-9 h-9">
        <FaArrowUp />
      </Button>
    </form>
  );
}
