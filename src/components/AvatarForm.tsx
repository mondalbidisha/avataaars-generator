import * as React from 'react'
import { AvatarStyle, Option, OptionContext } from 'avataaars'
import {
  // Button,
  Col,
  ControlLabel,
  Form,
  FormControl,
  FormGroup
} from 'react-bootstrap'

interface SelectProps {
  controlId: string
  label: string
  value: string
  onChange?: (value: string) => void
}

// ref: https://stackoverflow.com/a/1714899/25077
// const serializeQuery = function (obj: any) {
//   const str = []
//   for (const p in obj) {
//     if (obj.hasOwnProperty(p)) {
//       str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
//     }
//   }
//   return str.join('&')
// }

class OptionSelect extends React.Component<SelectProps> {
  render() {
    const { controlId, label, value, children } = this.props
    return (
      <FormGroup className='row' controlId={controlId}>
        <Col componentClass={ControlLabel} sm={3}>
          {label}
        </Col>
        <Col sm={9}>
          <FormControl
            componentClass='select'
            value={value}
            onChange={this.onChange}>
            {children}
          </FormControl>
        </Col>
      </FormGroup>
    )
  }

  private onChange = (event: React.FormEvent<FormControl>) => {
    if (this.props.onChange) {
      this.props.onChange(((event.target as any) as HTMLSelectElement).value)
    }
  }
}

export interface Props {
  avatarStyle: AvatarStyle
  optionContext: OptionContext
  displayingCode: boolean
  displayingImg: boolean
  onDownloadPNG?: () => void
  onDownloadSVG?: () => void
  onAvatarStyleChange?: (avatarStyle: AvatarStyle) => void
  onToggleCode?: () => void
  onToggleImg?: () => void
}

export default class AvatarForm extends React.Component<Props> {
  private onChangeCache: Array<(value: string) => void> = []

  componentWillMount() {
    const { optionContext } = this.props
    optionContext.addStateChangeListener(() => {
      this.forceUpdate()
    })
    this.onChangeCache = optionContext.options.map(option =>
      this.onChange.bind(this, option)
    )
  }

  render() {
    const { optionContext, avatarStyle } = this.props
    const selects = optionContext.options.map((option, index) => {
      const optionState = optionContext.getOptionState(option.key)!
      if (optionState.available <= 0) {
        return null
      }
      const selectOptions = optionState.options.map(type => (
        <option key={type} value={type}>
          {type}
        </option>
      ))
      const value = optionContext.getValue(option.key)!
      return (
        <OptionSelect
          key={option.key}
          controlId={option.key}
          label={option.label}
          value={value}
          onChange={this.onChangeCache[index]}>
          {selectOptions}
        </OptionSelect>
      )
    })
    return (
      <Form horizontal>
        <FormGroup className='row' controlId='avatar-style'>
          <Col componentClass={ControlLabel} sm={3}>
            Avatar Style
          </Col>
          <Col sm={9}>
            <label>
              <input
                type='radio'
                id='avatar-style-circle'
                name='avatar-style'
                value={AvatarStyle.Circle}
                checked={avatarStyle === AvatarStyle.Circle}
                onChange={this.onAvatarStyleChange}
              />{' '}
              Circle
            </label>{' '}
            <label>
              <input
                type='radio'
                id='avatar-style-transparent'
                name='avatar-style'
                value={AvatarStyle.Transparent}
                checked={avatarStyle === AvatarStyle.Transparent}
                onChange={this.onAvatarStyleChange}
              />{' '}
              Transparent
            </label>
          </Col>
        </FormGroup>
        {selects}
      </Form>
    )
  }

  private onChange(option: Option, value: string) {
    const { optionContext } = this.props
    optionContext.setValue(option.key, value)
  }

  private onAvatarStyleChange = (event: React.FormEvent<HTMLInputElement>) => {
    if (this.props.onAvatarStyleChange) {
      this.props.onAvatarStyleChange((event.target as any).value)
    }
  }
}
