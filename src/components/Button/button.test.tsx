import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import  Button, {ButtonSize, ButtonType}  from "./button";

const defaultProps = {
  onClick: jest.fn()
}

const testProps = {
  size: ButtonSize.Large,
  btnType: ButtonType.Primary,
  className: 'klass'
}

const linkProps = {
  href: 'http://www.baidu.com',
  btnType: ButtonType.Link
}

const disabledProps = {
  disabled: true,
  onClick: jest.fn()
}

describe('test Button component', () => {
  it('should render the correct default button', () => {
    render(<Button {...defaultProps}>Nice</Button>)
    const element = screen.getByText('Nice') as HTMLButtonElement
    expect(element).toBeInTheDocument()
    expect(element.tagName).toEqual('BUTTON')
    expect(element).toHaveClass('btn btn-default')
    fireEvent.click(element)
    expect(defaultProps.onClick).toBeCalled()
    expect(element.disabled).toBeFalsy()
  })
  it('should render the correct component based on different props', () => {
    render(<Button {...testProps}>Nice</Button>)
    const element = screen.getByText('Nice')
    expect(element).toBeInTheDocument()
    expect(element).toHaveClass('btn btn-lg btn-primary klass')
  })
  it('should render a link when btnType equals link and href is provided', () => {
    render(<Button {...linkProps}>Link</Button>)
    const element = screen.getByText('Link')
    expect(element).toBeInTheDocument()
    expect(element.tagName).toEqual('A')
    expect(element).toHaveClass('btn btn-link')
    

  })
  it('should render disabled button when disabled set to true', () => {
    render(<Button {...disabledProps}>disable</Button>)
    const element = screen.getByText('disable') as HTMLButtonElement
    expect(element.disabled).toBeTruthy()
    fireEvent.click(element)
    expect(disabledProps.onClick).not.toHaveBeenCalled()

  })
})

