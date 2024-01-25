import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Link, Route, Routes } from 'react-router-dom';
import { graphql } from 'react-relay';
import * as R from 'ramda';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { QueryRenderer, requestSubscription } from '../../../../relay/environment';
import Note from './Note';
import FileManager from '../../common/files/FileManager';
import StixCoreObjectHistory from '../../common/stix_core_objects/StixCoreObjectHistory';
import ContainerHeader from '../../common/containers/ContainerHeader';
import Loader from '../../../../components/Loader';
import ErrorNotFound from '../../../../components/ErrorNotFound';
import NotePopover from './NotePopover';
import inject18n from '../../../../components/i18n';
import { CollaborativeSecurity } from '../../../../utils/Security';
import { KNOWLEDGE_KNUPDATE_KNDELETE } from '../../../../utils/hooks/useGranted';
import withRouter from '../../../../utils/compat-router/withRouter';

const subscription = graphql`
  subscription RootNoteSubscription($id: ID!) {
    stixDomainObject(id: $id) {
      ... on Note {
        ...Note_note
        ...NoteEditionContainer_note
      }
      ...FileImportViewer_entity
      ...FileExportViewer_entity
      ...FileExternalReferencesViewer_entity
      ...WorkbenchFileViewer_entity
    }
  }
`;

const noteQuery = graphql`
  query RootNoteQuery($id: String!) {
    note(id: $id) {
      id
      standard_id
      entity_type
      ...Note_note
      ...NoteDetails_note
      ...ContainerHeader_container
      ...ContainerStixDomainObjects_container
      ...ContainerStixObjectsOrStixRelationships_container
      ...FileImportViewer_entity
      ...FileExportViewer_entity
      ...FileExternalReferencesViewer_entity
      ...WorkbenchFileViewer_entity
    }
    connectorsForExport {
      ...FileManager_connectorsExport
    }
    connectorsForImport {
      ...FileManager_connectorsImport
    }
  }
`;

class RootNote extends Component {
  constructor(props) {
    super(props);
    const {
      match: {
        params: { noteId },
      },
    } = props;
    this.sub = requestSubscription({
      subscription,
      variables: { id: noteId },
    });
  }

  componentWillUnmount() {
    this.sub.dispose();
  }

  render() {
    const {
      t,
      location,
      match: {
        params: { noteId },
      },
    } = this.props;
    return (
      <>
        <QueryRenderer
          query={noteQuery}
          variables={{ id: noteId }}
          render={({ props }) => {
            if (props) {
              if (props.note) {
                const { note } = props;
                return (
                  <div
                    style={{
                      paddingRight: location.pathname.includes(
                        `/dashboard/analyses/notes/${note.id}/knowledge`,
                      )
                        ? 200
                        : 0,
                    }}
                  >
                    <CollaborativeSecurity
                      data={note}
                      needs={[KNOWLEDGE_KNUPDATE_KNDELETE]}
                      placeholder={
                        <ContainerHeader
                          container={note}
                          PopoverComponent={<NotePopover note={note} />}
                        />
                      }
                    >
                      <ContainerHeader
                        container={props.note}
                        PopoverComponent={<NotePopover note={note} />}
                      />
                    </CollaborativeSecurity>
                    <Box
                      sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        marginBottom: 4,
                      }}
                    >
                      <Tabs
                        value={
                          location.pathname.includes(
                            `/dashboard/analyses/notes/${note.id}/knowledge`,
                          )
                            ? `/dashboard/analyses/notes/${note.id}/knowledge`
                            : location.pathname
                        }
                      >
                        <Tab
                          component={Link}
                          to={`/dashboard/analyses/notes/${note.id}`}
                          value={`/dashboard/analyses/notes/${note.id}`}
                          label={t('Overview')}
                        />
                        <Tab
                          component={Link}
                          to={`/dashboard/analyses/notes/${note.id}/files`}
                          value={`/dashboard/analyses/notes/${note.id}/files`}
                          label={t('Data')}
                        />
                        <Tab
                          component={Link}
                          to={`/dashboard/analyses/notes/${note.id}/history`}
                          value={`/dashboard/analyses/notes/${note.id}/history`}
                          label={t('History')}
                        />
                      </Tabs>
                    </Box>
                    <Routes>
                      <Route
                        exact
                        path="/dashboard/analyses/notes/:noteId"
                        render={(routeProps) => (
                          <Note {...routeProps} note={props.note} />
                        )}
                      />
                      <Route
                        exact
                        path="/dashboard/analyses/notes/:noteId/files"
                        render={(routeProps) => (
                          <FileManager
                            {...routeProps}
                            id={noteId}
                            connectorsExport={props.connectorsForExport}
                            connectorsImport={props.connectorsForImport}
                            entity={props.note}
                          />
                        )}
                      />
                      <Route
                        exact
                        path="/dashboard/analyses/notes/:noteId/history"
                        render={(routeProps) => (
                          <StixCoreObjectHistory
                            {...routeProps}
                            stixCoreObjectId={noteId}
                            withoutRelations={true}
                          />
                        )}
                      />
                    </Routes>
                  </div>
                );
              }
              return <ErrorNotFound />;
            }
            return <Loader />;
          }}
        />
      </>
    );
  }
}

RootNote.propTypes = {
  children: PropTypes.node,
  match: PropTypes.object,
};

export default R.compose(inject18n, withRouter)(RootNote);
