import { FaArrowUp } from 'react-icons/fa';
import { Button } from './ui/button';
import { useForm } from 'react-hook-form';
import axios from 'axios';

function Chatbot() {
  type FormData = {
    prompt: string;
  };
  const { register, handleSubmit, reset, formState } = useForm<FormData>();

  const onSubmit = async ({ prompt }: FormData) => {
    reset();
    const { data } = await axios.post('/api/chat', { prompt });
    console.log(data);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <form
      className="flex flex-col gap-2 items-end border-2 rounded-3xl p-4"
      onSubmit={handleSubmit(onSubmit)}
      onKeyDown={(e) => onKeyDown(e)}
    >
      <textarea
        {...register('prompt', {
          required: true,
          validate: (data) => data.trim().length > 0,
        })}
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

export default Chatbot;
