import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface CommonModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onRequestClose?: () => void;
  confirmStyle?: ViewStyle;
  cancelStyle?: ViewStyle;
}

export function CommonModal({
  visible,
  title,
  message,
  children,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  onRequestClose,
  confirmStyle,
  cancelStyle,
}: CommonModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose ?? onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <View style={styles.panel}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {message ? <Text style={styles.message}>{message}</Text> : null}
          {children}
          <View style={styles.actions}>
            <Pressable style={[styles.cancelButton, cancelStyle]} onPress={onCancel}>
              <Text style={styles.cancelText}>{cancelText}</Text>
            </Pressable>
            <Pressable style={[styles.confirmButton, confirmStyle]} onPress={onConfirm}>
              <Text style={styles.confirmText}>{confirmText}</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  panel: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 18,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  cancelText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#FF6B6B',
  },
  confirmText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});
