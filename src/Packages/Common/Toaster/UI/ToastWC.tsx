import React, { Component } from "react";
import { Power1, TimelineLite } from "gsap";
import styled from "styled-components";
import { StyledWCProps, createBoxShadowCss } from "Packages/Common/Design";
import { Message, Toast, ToastTypes } from "../Domain/Types";
import { MessageWC } from "./MessageWC";

const StyledToast = styled.div`
  margin-top: 20px;
  background-color: white;
  margin-right: 20px;
  border-top: 3px solid
    ${(props: StyledWCProps) => props.theme.colorPrimary};
  overflow: hidden;
  ${createBoxShadowCss()}
  &.info {
    border-color: ${(props: StyledWCProps) => props.theme.colorInfo};
  }
  &.success {
    border-color: ${(props: StyledWCProps) => props.theme.colorSuccess};
  }
  &.warning {
    border-color: ${(props: StyledWCProps) => props.theme.colorWarning};
  }
  &.error {
    border-color: ${(props: StyledWCProps) => props.theme.colorError};
  }
`;

export type ToastWCProps = {
    toast: Toast
    onRemoveMessage(messageId: string): void
};

export class ToastWC extends Component<ToastWCProps> {
  private toastWrapperElement: HTMLDivElement;

  private toastElement: HTMLDivElement;

  private introAnimation: TimelineLite;

  private outroAnimation: TimelineLite;

  componentDidMount() {
      if (this.props.toast.isIntroAnimationRunning) {
          this.playIntroAnimation();
      }
  }

  componentDidUpdate(prevProps: ToastWCProps) {
      if (
          this.props.toast.isOutroAnimationRunning
        && prevProps.toast.isOutroAnimationRunning
        !== this.props.toast.isOutroAnimationRunning
      ) {
          this.playOutroAnimation();
      }
  }

  playIntroAnimation() {
      this.introAnimation = new TimelineLite({ paused: true });
      this.introAnimation.addLabel("start");
      this.introAnimation.fromTo(
          this.toastWrapperElement,
          { height: 0 },
          { height: "auto", duration: 0.3 },
          "start",
      );
      this.introAnimation.fromTo(
          this.toastElement,
          { opacity: 0, y: -25 },
          {
              opacity: 1, y: 0, marginTop: 20, duration: 0.5, ease: Power1.easeOut,
          },
          "start",
      );
      this.introAnimation.play();
  }

  playOutroAnimation() {
      this.outroAnimation = new TimelineLite({ paused: true });
      this.outroAnimation.to(this.toastElement, {
          opacity: 0,
          y: 25,
          marginTop: 0,
          duration: 0.4,
          ease: Power1.easeIn,
      });
      this.outroAnimation.to(this.toastWrapperElement, {
          height: 0,
          duration: 0.15,
      });
      if (this.introAnimation) {
          this.introAnimation.pause();
      }
      this.outroAnimation.play();
  }

  createToastTypeClassName(): string {
      if (this.props.toast.type === ToastTypes.SUCCESS) {
          return "success";
      }
      if (this.props.toast.type === ToastTypes.WARNING) {
          return "warning";
      }
      if (this.props.toast.type === ToastTypes.ERROR) {
          return "error";
      }
      return "info";
  }

  render() {
      return (
          <div
              ref={(element: HTMLDivElement) => { this.toastWrapperElement = element; }}
              className="app-toast-wrapper"
          >
              <StyledToast
                  ref={(element: HTMLDivElement) => { this.toastElement = element; }}
                  className={this.createToastTypeClassName()}
              >
                  {this.props.toast.messages.map((message: Message) => (
                      <MessageWC
                          key={message.id}
                          message={message}
                          onRemove={() => this.props.onRemoveMessage(message.id)}
                      />
                  ))}
              </StyledToast>
          </div>
      );
  }
}
