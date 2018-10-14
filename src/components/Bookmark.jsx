import React from  'react'
import styled from 'styled-components'
import { Draggable } from 'react-beautiful-dnd'
import axios from 'axios'
import '../styles/Task.css'
import apiUrl from '../helpers/apiUrl'

const Container = styled.div`
  padding: 8px;
  padding-left: 1em;
  margin-bottom: 0.5em;
  transition: all 0.3s ease;
  border-radius: 0.3em;
  &:hover ${Container}{
    background-color: #F7F7F7;
  }
`

const Bookmark = (props) => {

  const isLinkFinished = () => (
    props.bookmark.finished ? 'finished' : 'not-finished'
  )

  const toggleFinished = () => {
    props.toggleFinished(props.bookmark.id, isLinkFinished())
  }

  const deleteBookmark = () => {
    props.deleteBookmark(props.bookmark.id, props.folder)
  }

  return (
    <Draggable draggableId={props.bookmark.id} index={props.index}>
    { (provided) => (
      <Container
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        innerRef={provided.innerRef}
      >
        <div className='link__container'>
          <a href={props.bookmark.url} target="_blank" className={isLinkFinished()} >{props.bookmark.content}</a>
          <div className="link__aside">
            <i className="fas fa-times"  onClick={deleteBookmark}></i>
            <i className="fas fa-question"></i>
            <i className={`fas fa-check ${isLinkFinished()}`} onClick={toggleFinished} ></i>
          </div>
        </div>
      </Container>
    )}
    </Draggable>
  )
}
export default Bookmark