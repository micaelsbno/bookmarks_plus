import React from 'react'
import styled from 'styled-components'
import Bookmark from './Bookmark'
import { Droppable } from 'react-beautiful-dnd'
import '../styles/Column.css'

const Container = styled.div`
  margin: 8px;
  border-radius: 2px;
  background-color: white;
  border-bottom: 0.1em solid rgba(173,172,172,0.26);
  padding: 1em
`
const Title = styled.h3`
  padding: 8px;
`
const BookmarkList = styled.div`
  padding: 8px;
`

export default class Folder extends React.Component {
  render(){
    return (
      <Container>
        <Title><div className="pointer"></div>{this.props.folder.title}</Title>
        <Droppable droppableId={this.props.folder.id}>
        {(provided) => (
          <BookmarkList
            innerRef={provided.innerRef}
            {...provided.droppableProps}
          >

            {this.props.bookmarks.map((bookmark,index) => (
              <Bookmark key={bookmark.id} bookmark={bookmark} index={index} updateSession={this.props.updateSession} />
            ))}
            {provided.placeholder}
          </BookmarkList>
        )}
        </Droppable>
      </Container>
    )
  }
}