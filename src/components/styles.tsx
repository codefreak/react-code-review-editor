import styled from "styled-components";

export const Pre = styled.pre`
  text-align: left;
  margin: 0em 0;
  padding: 0em;
  overflow: auto;

  & .token-line {
    line-height: 1.3em;
    height: 1.3em;
  }
`;

export const Line = styled.div`
  display: table-row;
`;

export const LineNo = styled.span`
  display: table-cell;
  text-align: right;
  padding-right: 0.5em;
  padding-left: 2em;
  user-select: none;
  opacity: 0.5;
  border-right: 0.2px solid;
`;

export const LineContent = styled.span`
  display: table-cell;
  padding-left: 2em; 

`;
