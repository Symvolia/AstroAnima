import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MONTHS, WEEKDAY_SHORT, useI18n } from '../i18n';
import { colors, radii } from '../theme';
import {
  formatDateIT,
  monthGrid,
  pad2,
  parseHm,
  parseIsoDate,
  toIsoDate,
} from '../utils/dateFormat';

export function DatePickerField({
  value,
  onChange,
  maximumDate,
}: {
  value: string;
  onChange: (iso: string) => void;
  maximumDate?: Date;
}) {
  const { copy } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={copy.form.dateA11y(formatDateIT(value))}
        onPress={() => setOpen(true)}
        style={styles.field}
      >
        <Text style={styles.fieldValue}>{formatDateIT(value)}</Text>
        <Text style={styles.fieldHint}>{copy.form.dateHint}</Text>
      </Pressable>
      <CalendarModal
        visible={open}
        value={value}
        maximumDate={maximumDate ?? new Date()}
        onClose={() => setOpen(false)}
        onSelect={(iso) => {
          onChange(iso);
          setOpen(false);
        }}
      />
    </>
  );
}

export function TimePickerField({
  value,
  onChange,
}: {
  value: string;
  onChange: (hm: string) => void;
}) {
  const { copy } = useI18n();
  const [open, setOpen] = useState(false);
  const { hours, minutes } = parseHm(value);
  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={copy.form.timeA11y(`${pad2(hours)}:${pad2(minutes)}`)}
        onPress={() => setOpen(true)}
        style={styles.field}
      >
        <Text style={styles.fieldValue}>
          {pad2(hours)}:{pad2(minutes)}
        </Text>
        <Text style={styles.fieldHint}>{copy.form.timeHint}</Text>
      </Pressable>
      <TimeModal
        visible={open}
        hours={hours}
        minutes={minutes}
        onClose={() => setOpen(false)}
        onSelect={(h, m) => {
          onChange(`${pad2(h)}:${pad2(m)}`);
          setOpen(false);
        }}
      />
    </>
  );
}

function CalendarModal({
  visible,
  value,
  maximumDate,
  onClose,
  onSelect,
}: {
  visible: boolean;
  value: string;
  maximumDate: Date;
  onClose: () => void;
  onSelect: (iso: string) => void;
}) {
  const { copy, lang } = useI18n();
  const months = MONTHS[lang];
  const weekdays = WEEKDAY_SHORT[lang];
  const selected = parseIsoDate(value);
  const [cursor, setCursor] = useState(() => ({
    year: selected.getFullYear(),
    month: selected.getMonth() + 1,
  }));

  useEffect(() => {
    if (!visible) return;
    const next = parseIsoDate(value);
    setCursor({ year: next.getFullYear(), month: next.getMonth() + 1 });
  }, [visible, value]);

  const cells = useMemo(() => monthGrid(cursor.year, cursor.month), [cursor.year, cursor.month]);
  const maxIso = toIsoDate(maximumDate);

  const shift = (delta: number) => {
    const date = new Date(cursor.year, cursor.month - 1 + delta, 1);
    setCursor({ year: date.getFullYear(), month: date.getMonth() + 1 });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.calSheet} onPress={() => undefined}>
          <View style={styles.nav}>
            <Pressable accessibilityRole="button" accessibilityLabel={copy.form.prevYear} onPress={() => setCursor((c) => ({ ...c, year: c.year - 1 }))} style={styles.navBtn}>
              <Text style={styles.navTxt}>«</Text>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel={copy.form.prevMonth} onPress={() => shift(-1)} style={styles.navBtn}>
              <Text style={styles.navTxt}>‹</Text>
            </Pressable>
            <Text style={styles.monthTitle}>
              {months[cursor.month - 1]} {cursor.year}
            </Text>
            <Pressable accessibilityRole="button" accessibilityLabel={copy.form.nextMonth} onPress={() => shift(1)} style={styles.navBtn}>
              <Text style={styles.navTxt}>›</Text>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel={copy.form.nextYear} onPress={() => setCursor((c) => ({ ...c, year: c.year + 1 }))} style={styles.navBtn}>
              <Text style={styles.navTxt}>»</Text>
            </Pressable>
          </View>
          <View style={styles.weekRow}>
            {weekdays.map((d) => (
              <Text key={d} style={styles.weekDay}>
                {d}
              </Text>
            ))}
          </View>
          <View style={styles.grid}>
            {cells.map((day, i) => {
              if (!day) return <View key={`e-${i}`} style={styles.cell} />;
              const iso = `${cursor.year}-${pad2(cursor.month)}-${pad2(day)}`;
              const disabled = iso > maxIso;
              const isOn = iso === value;
              return (
                <Pressable
                  key={iso}
                  disabled={disabled}
                  accessibilityRole="button"
                  accessibilityLabel={`${day} ${months[cursor.month - 1]} ${cursor.year}`}
                  onPress={() => onSelect(iso)}
                  style={[styles.cell, isOn && styles.cellOn, disabled && styles.cellOff]}
                >
                  <Text style={[styles.cellTxt, isOn && styles.cellTxtOn, disabled && styles.cellTxtOff]}>{day}</Text>
                </Pressable>
              );
            })}
          </View>
          <Pressable accessibilityRole="button" onPress={onClose} style={styles.close}>
            <Text style={styles.closeTxt}>{copy.form.close}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function TimeModal({
  visible,
  hours,
  minutes,
  onClose,
  onSelect,
}: {
  visible: boolean;
  hours: number;
  minutes: number;
  onClose: () => void;
  onSelect: (h: number, m: number) => void;
}) {
  const { copy } = useI18n();
  const [h, setH] = useState(hours);
  const [m, setM] = useState(minutes);

  useEffect(() => {
    if (!visible) return;
    setH(hours);
    setM(minutes);
  }, [visible, hours, minutes]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.timeSheet} onPress={() => undefined}>
          <Text style={styles.monthTitle}>{copy.form.chooseTime}</Text>
          <Text style={styles.preview}>
            {pad2(h)}:{pad2(m)}
          </Text>
          <View style={styles.timeCols}>
            <View style={styles.timeCol}>
              <Text style={styles.colLabel}>{copy.form.hours}</Text>
              <ScrollView style={styles.colScroll} contentContainerStyle={styles.colContent}>
                {Array.from({ length: 24 }, (_, i) => (
                  <Pressable
                    key={`h-${i}`}
                    accessibilityRole="button"
                    accessibilityLabel={`${pad2(i)} ore`}
                    onPress={() => setH(i)}
                    style={[styles.timeItem, h === i && styles.timeItemOn]}
                  >
                    <Text style={[styles.timeItemTxt, h === i && styles.timeItemTxtOn]}>{pad2(i)}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            <Text style={styles.colon}>:</Text>
            <View style={styles.timeCol}>
              <Text style={styles.colLabel}>{copy.form.minutes}</Text>
              <ScrollView style={styles.colScroll} contentContainerStyle={styles.colContent}>
                {Array.from({ length: 60 }, (_, i) => (
                  <Pressable
                    key={`m-${i}`}
                    accessibilityRole="button"
                    accessibilityLabel={`${pad2(i)} minuti`}
                    onPress={() => setM(i)}
                    style={[styles.timeItem, m === i && styles.timeItemOn]}
                  >
                    <Text style={[styles.timeItemTxt, m === i && styles.timeItemTxtOn]}>{pad2(i)}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
          <Pressable accessibilityRole="button" onPress={() => onSelect(h, m)} style={styles.confirm}>
            <Text style={styles.confirmTxt}>{copy.form.confirmTime}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={onClose} style={styles.close}>
            <Text style={styles.closeTxt}>{copy.form.cancel}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  field: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.md,
    padding: 14,
    backgroundColor: colors.surface,
    gap: 4,
  },
  fieldValue: { color: colors.cream, fontSize: 18, fontWeight: '600' },
  fieldHint: { color: colors.muted, fontSize: 12 },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.62)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  calSheet: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: colors.surfaceSolid,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.gold,
    padding: 12,
    gap: 6,
  },
  timeSheet: {
    width: '100%',
    maxWidth: 280,
    backgroundColor: colors.surfaceSolid,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.gold,
    padding: 12,
    gap: 8,
  },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  navBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  navTxt: { color: colors.gold, fontSize: 18, lineHeight: 22 },
  monthTitle: { color: colors.cream, fontSize: 14, fontFamily: 'Georgia', textAlign: 'center', flex: 1 },
  weekRow: { flexDirection: 'row' },
  weekDay: { width: '14.28%', textAlign: 'center', color: colors.gold, fontSize: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: {
    width: '14.28%',
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellOn: { backgroundColor: colors.gold, borderRadius: 10 },
  cellOff: { opacity: 0.28 },
  cellTxt: { color: colors.cream, fontSize: 13 },
  cellTxtOn: { color: colors.night, fontWeight: '700' },
  cellTxtOff: { color: colors.muted },
  close: { alignItems: 'center', paddingVertical: 4 },
  closeTxt: { color: colors.muted, fontSize: 13 },
  preview: { color: colors.goldSoft, fontSize: 28, textAlign: 'center', fontVariant: ['tabular-nums'] },
  timeCols: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 168 },
  timeCol: { flex: 1 },
  colLabel: { color: colors.gold, textAlign: 'center', marginBottom: 4, fontSize: 11, letterSpacing: 1 },
  colScroll: { maxHeight: 140 },
  colContent: { paddingVertical: 4, gap: 2 },
  colon: { color: colors.gold, fontSize: 22, marginTop: 14 },
  timeItem: {
    paddingVertical: 5,
    borderRadius: radii.sm,
    alignItems: 'center',
  },
  timeItemOn: { backgroundColor: colors.gold },
  timeItemTxt: { color: colors.cream, fontSize: 15, fontVariant: ['tabular-nums'] },
  timeItemTxtOn: { color: colors.night, fontWeight: '700' },
  confirm: {
    backgroundColor: colors.gold,
    borderRadius: radii.full,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  confirmTxt: { color: colors.night, fontWeight: '700' },
});
