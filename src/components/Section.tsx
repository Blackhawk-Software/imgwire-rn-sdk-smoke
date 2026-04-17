import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

type SectionProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

type ControlButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  tone?: 'default' | 'danger';
};

type StatusTextProps = {
  label: string;
  value: string;
  tone?: 'default' | 'success' | 'error' | 'warning';
};

type JsonBlockProps = {
  title: string;
  value: unknown;
};

type SdkErrorBoundaryProps = {
  fallbackTitle?: string;
  children: React.ReactNode;
};

type SdkErrorBoundaryState = {
  error: Error | null;
};

export function Section({ title, subtitle, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

export function ControlButton({
  label,
  onPress,
  disabled,
  tone = 'default',
}: ControlButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        tone === 'danger' ? styles.buttonDanger : styles.buttonDefault,
        disabled ? styles.buttonDisabled : null,
        pressed && !disabled ? styles.buttonPressed : null,
      ]}
    >
      <Text style={styles.buttonLabel}>{label}</Text>
    </Pressable>
  );
}

export function Row({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.row, style]}>{children}</View>;
}

export function StatusText({
  label,
  value,
  tone = 'default',
}: StatusTextProps) {
  const toneStyle: StyleProp<TextStyle> =
    tone === 'success'
      ? styles.statusSuccess
      : tone === 'error'
        ? styles.statusError
        : tone === 'warning'
          ? styles.statusWarning
          : styles.statusDefault;

  return (
    <Text style={[styles.status, toneStyle]}>
      {label}: {value}
    </Text>
  );
}

export function JsonBlock({ title, value }: JsonBlockProps) {
  return (
    <View style={styles.jsonBlock}>
      <Text style={styles.jsonTitle}>{title}</Text>
      <Text selectable style={styles.jsonText}>
        {JSON.stringify(value, null, 2)}
      </Text>
    </View>
  );
}

export class SdkErrorBoundary extends React.Component<
  SdkErrorBoundaryProps,
  SdkErrorBoundaryState
> {
  state: SdkErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error('Imgwire SDK rendering error', error);
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>
            {this.props.fallbackTitle ?? 'SDK render error'}
          </Text>
          <Text selectable style={styles.errorText}>
            {this.state.error.message}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#ffffff',
    borderColor: '#d7deea',
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
    padding: 16,
  },
  title: {
    color: '#102542',
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    color: '#5e6d87',
    fontSize: 13,
    lineHeight: 20,
  },
  body: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    borderRadius: 10,
    minWidth: 84,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  buttonDefault: {
    backgroundColor: '#102542',
  },
  buttonDanger: {
    backgroundColor: '#b42318',
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  buttonLabel: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  status: {
    fontSize: 13,
  },
  statusDefault: {
    color: '#22324f',
  },
  statusSuccess: {
    color: '#137333',
  },
  statusError: {
    color: '#b42318',
  },
  statusWarning: {
    color: '#7c5b00',
  },
  jsonBlock: {
    backgroundColor: '#f3f6fb',
    borderRadius: 12,
    gap: 8,
    padding: 12,
  },
  jsonTitle: {
    color: '#102542',
    fontSize: 13,
    fontWeight: '700',
  },
  jsonText: {
    color: '#33415c',
    fontFamily: 'Courier',
    fontSize: 12,
  },
  errorCard: {
    backgroundColor: '#fef3f2',
    borderColor: '#fecdca',
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
    padding: 12,
  },
  errorTitle: {
    color: '#b42318',
    fontSize: 14,
    fontWeight: '700',
  },
  errorText: {
    color: '#912018',
    fontSize: 13,
  },
});
