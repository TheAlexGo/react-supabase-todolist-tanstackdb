import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import React from 'react';
import { NavigationPage } from '@/components/navigation/NavigationPage';
import { listsCollection, useSupabase } from '@/components/providers/SystemProvider';
import { GuardBySync } from '@/components/widgets/GuardBySync';
import { SearchBarWidget } from '@/components/widgets/SearchBarWidget';
import { TodoListsWidget } from '@/components/widgets/TodoListsWidget';
import { S } from './-styles';

export const Route = createFileRoute('/views/todo-lists/')({
  component: TodoListsPage,
});

function TodoListsPage() {
  const supabase = useSupabase();

  const [showPrompt, setShowPrompt] = React.useState(false);
  const nameInputRef = React.useRef<HTMLInputElement>(null);

  const createNewList = async (name: string) => {
    const session = await supabase?.client.auth.getSession();
    const userID = session?.data.session?.user?.id;
    if (!userID) {
      throw new Error(`Could not create new lists, no userID found`);
    }

    // This could alternatively be synchronous and use optimistic updates
    await listsCollection.insert({
      id: crypto.randomUUID(),
      name,
      created_at: new Date(),
      owner_id: userID,
    }).isPersisted.promise;
  };

  return (
    <NavigationPage title="Todo Lists">
      <Box>
        <S.FloatingActionButton onClick={() => setShowPrompt(true)}>
          <AddIcon />
        </S.FloatingActionButton>
        <Box>
          <SearchBarWidget />
          <GuardBySync>
            <TodoListsWidget />
          </GuardBySync>
        </Box>
        {/* TODO use a dialog service in future, this is just a simple example app */}
        <Dialog
          open={showPrompt}
          onClose={() => setShowPrompt(false)}
          PaperProps={{
            component: 'form',
            onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              await createNewList(nameInputRef.current!.value);
              setShowPrompt(false);
            },
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Create Todo List</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">Enter a name for a new todo list</DialogContentText>
            <TextField sx={{ marginTop: '10px' }} fullWidth inputRef={nameInputRef} label="List Name" autoFocus />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowPrompt(false)}>Cancel</Button>
            <Button type="submit">Create</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </NavigationPage>
  );
}
