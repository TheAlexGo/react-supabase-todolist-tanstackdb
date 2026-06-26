import { Alert, Button, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useQuery } from '@powersync/react';
import { createFileRoute } from '@tanstack/react-router';
import React from 'react';
import { NavigationPage } from '@/components/navigation/NavigationPage';
import { S } from './-styles';

export const Route = createFileRoute('/views/sql-console/')({
  component: SQLConsolePage,
});

export interface LoginFormParams {
  email: string;
  password: string;
}

const DEFAULT_QUERY = /* sql */ `
  SELECT
    *
  FROM
    lists
`;

const TableDisplay = React.memo(({ data }: { data: ReadonlyArray<any> }) => {
  const queryDataGridResult = React.useMemo(() => {
    const firstItem = data?.[0];
    return {
      columns: firstItem
        ? Object.keys(firstItem).map(field => ({
            field,
            flex: 1,
          }))
        : [],
      rows: data,
    };
  }, [data]);

  return (
    <S.QueryResultContainer>
      <DataGrid
        autoHeight={true}
        rows={queryDataGridResult.rows.map((r, index) => ({ ...r, id: r.id ?? index })) ?? []}
        columns={queryDataGridResult.columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 20,
            },
          },
        }}
        pageSizeOptions={[20]}
        disableRowSelectionOnClick
      />
    </S.QueryResultContainer>
  );
});

/**
 * The page here is as it's named. A SQL console for debug purposes.
 * We provide SQL access to the PowerSync database.
 * We cannot use TanStack collections for this page.
 */
function SQLConsolePage() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [query, setQuery] = React.useState(DEFAULT_QUERY);

  const { data, error } = useQuery(query, [], {
    /**
     * We don't use the isFetching status here, we can avoid re-renders if we don't report on it.
     */
    reportFetching: false,
    /**
     * The query here will only emit results when the query data set changes.
     * Result sets are compared by serializing each item to JSON and comparing the strings.
     */
    rowComparator: {
      keyBy: (item: any) => JSON.stringify(item),
      compareBy: (item: any) => JSON.stringify(item),
    },
  });

  return (
    <NavigationPage title="SQL Console">
      <S.MainContainer>
        <S.CenteredGrid container>
          <S.CenteredGrid item xs={12} md={10}>
            <TextField
              inputRef={inputRef}
              fullWidth
              label="Query"
              defaultValue={DEFAULT_QUERY}
              onKeyDown={(e) => {
                const inputValue = inputRef.current?.value;
                if (e.key === 'Enter' && inputValue) {
                  setQuery(inputValue);
                }
              }}
            />
          </S.CenteredGrid>
          <S.CenteredGrid item xs={12} md={2}>
            <Button
              sx={{ margin: '10px' }}
              variant="contained"
              onClick={() => {
                const queryInput = inputRef?.current?.value;
                if (queryInput) {
                  setQuery(queryInput);
                }
              }}
            >
              Execute Query
            </Button>
          </S.CenteredGrid>
        </S.CenteredGrid>
        {error ? <Alert severity="error">{error.message}</Alert> : null}
        <TableDisplay data={data} />
      </S.MainContainer>
    </NavigationPage>
  );
}
