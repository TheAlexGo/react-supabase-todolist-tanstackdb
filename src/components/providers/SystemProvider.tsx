import type { ListRecord } from '@/library/powersync/ListsSchema';
import { CircularProgress } from '@mui/material';
import { PowerSyncContext } from '@powersync/react';
import { createBaseLogger, LogLevel, PowerSyncDatabase, WASQLiteOpenFactory, WASQLiteVFS } from '@powersync/web';
import { BasicIndex, createCollection } from '@tanstack/db';
import { powerSyncCollectionOptions } from '@tanstack/powersync-db-collection';
import React, { Suspense } from 'react';
import { AppSchema } from '@/library/powersync/AppSchema';
import { ListsDeserializationSchema, ListsSchema } from '@/library/powersync/ListsSchema';
import { SupabaseConnector } from '@/library/powersync/SupabaseConnector';
import { TodosDeserializationSchema, TodosSchema } from '@/library/powersync/TodosSchema';
import { NavigationPanelContextProvider } from '../navigation/NavigationPanelContext';

const SupabaseContext = React.createContext<SupabaseConnector | null>(null);
export const useSupabase = () => React.use(SupabaseContext);

export const db = new PowerSyncDatabase({
  schema: AppSchema,
  database: new WASQLiteOpenFactory({
    dbFilename: 'example.db',
    vfs: WASQLiteVFS.OPFSCoopSyncVFS,
  }),
});

export const listsCollection = createCollection(
  powerSyncCollectionOptions({
    database: db,
    table: AppSchema.props.lists,
    schema: ListsSchema,
    deserializationSchema: ListsDeserializationSchema,
    onDeserializationError: (error) => {
      // This should be fixed in development
      console.error(`Could not deserialize lists collection! ${error.issues.map(i => i.message).join(', ')}`);
    },
  }),
);

export const todosCollection = createCollection(
  powerSyncCollectionOptions({
    database: db,
    table: AppSchema.props.todos,
    schema: TodosSchema,
    deserializationSchema: TodosDeserializationSchema,
    onDeserializationError: (error) => {
      // This should be fixed in development
      console.error(`Could not deserialize todos collection! ${error.issues.map(i => i.message).join(', ')}`);
    },
  }),
);

todosCollection.createIndex(
  todo => todo.list_id,
  {
    indexType: BasicIndex,
  },
);

export type EnhancedListRecord = ListRecord & { total_tasks: number; completed_tasks: number };

export function SystemProvider({ children }: { children: React.ReactNode }) {
  const [connector] = React.useState(() => new SupabaseConnector());
  const [powerSync] = React.useState(db);

  React.useEffect(() => {
    const logger = createBaseLogger();
    logger.useDefaults();
    logger.setLevel(LogLevel.DEBUG);
    // For console testing purposes
    (window as any)._powersync = powerSync;

    powerSync.init();
    const l = connector.registerListener({
      initialized: () => {},
      sessionStarted: () => {
        powerSync.connect(connector);
      },
    });

    connector.init();

    return () => l?.();
  }, [powerSync, connector]);

  return (
    <Suspense fallback={<CircularProgress />}>
      <PowerSyncContext value={powerSync}>
        <SupabaseContext value={connector}>
          <NavigationPanelContextProvider>{children}</NavigationPanelContextProvider>
        </SupabaseContext>
      </PowerSyncContext>
    </Suspense>
  );
}

export default SystemProvider;
