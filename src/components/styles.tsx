import styled from 'styled-components'

export const Pre = styled.pre`
  text-align: left;
  margin: 0em 0;
  padding: 0em;
  overflow: hidden;

  & .token-line {
    line-height: 1.6em;
    height: 1.6em;
  }
`

export const Line = styled.div`
  display: table-row;
`

export const LineNo = styled.span`
  display: table-cell;
  text-align: right;
  user-select: none;
  padding-right: 0.5em;
  opacity: 0.5;
`

export const LineContent = styled.span`
  display: table-cell;
  padding-left: 2em;
  border-left: 1px solid #d9d9d9;
`
