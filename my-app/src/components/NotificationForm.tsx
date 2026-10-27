import { useForm } from 'react-hook-form';
import { Alert, Box, Button, Stack, TextField } from '@mui/material';
import { ApiError } from '../api/httpClient';
import type { CreateNotificationDto } from '../types/notification';

// Mirrors the constraints on CreateNotificationDto in the API.
export const TITLE_MAX = 100;
export const MESSAGE_MAX = 500;

type FormValues = CreateNotificationDto;

const emptyValues: FormValues = { title: '', message: '' };
const fieldNames = Object.keys(emptyValues) as (keyof FormValues)[];

interface NotificationFormProps {
  defaultValues?: FormValues;
  /** May throw an ApiError; its server-side validation errors are mapped back onto the matching fields. */
  onSubmit: (values: FormValues) => Promise<void>;
  submitLabel?: string;
  onCancel?: () => void;
}

export default function NotificationForm({
  defaultValues = emptyValues,
  onSubmit,
  submitLabel = 'Save',
  onCancel,
}: Readonly<NotificationFormProps>) {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues, mode: 'onTouched' });

  const submit = async (values: FormValues) => {
    const payload = { title: values.title.trim(), message: values.message.trim() };
    try {
      await onSubmit(payload);
      reset(emptyValues);
    } catch (err) {
      const fieldErrors = err instanceof ApiError ? err.fieldErrors : {};
      let mapped = false;
      Object.entries(fieldErrors).forEach(([key, messages]) => {
        const field = (key.charAt(0).toLowerCase() + key.slice(1)) as keyof FormValues;
        if (fieldNames.includes(field)) {
          setError(field, { type: 'server', message: [messages].flat().join(' ') });
          mapped = true;
        }
      });
      if (!mapped) {
        const message = err instanceof Error ? err.message : 'Something went wrong.';
        setError('root.server', { type: 'server', message });
      }
    }
  };

  const titleLength = watch('title')?.length ?? 0;
  const messageLength = watch('message')?.length ?? 0;

  const requiredTrimmed = (label: string) => (v: string) =>
    v.trim().length > 0 || `${label} is required`;

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(submit)}>
      <Stack spacing={3}>
        {errors.root?.server && <Alert severity="error">{errors.root.server.message}</Alert>}

        <TextField
          label="Title"
          fullWidth
          required
          error={Boolean(errors.title)}
          helperText={errors.title?.message ?? `${titleLength}/${TITLE_MAX}`}
          {...register('title', {
            validate: requiredTrimmed('Title'),
            maxLength: { value: TITLE_MAX, message: `Title must be at most ${TITLE_MAX} characters` },
          })}
        />

        <TextField
          label="Message"
          fullWidth
          required
          multiline
          minRows={4}
          error={Boolean(errors.message)}
          helperText={errors.message?.message ?? `${messageLength}/${MESSAGE_MAX}`}
          {...register('message', {
            validate: requiredTrimmed('Message'),
            maxLength: {
              value: MESSAGE_MAX,
              message: `Message must be at most ${MESSAGE_MAX} characters`,
            },
          })}
        />

        <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
          {onCancel && (
            <Button onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : submitLabel}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
