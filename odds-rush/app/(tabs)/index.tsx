import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BetAmountSelector } from '@/components/game/bet-amount-selector';
import { GameHeader } from '@/components/game/game-header';
import { MatchupCard } from '@/components/game/matchup-card';
import { OutcomeButtons } from '@/components/game/outcome-buttons';
import { RevealCard } from '@/components/game/reveal-card';
import { ResultPanel } from '@/components/game/result-panel';
import { SessionSummary } from '@/components/game/session-summary';
import { TimerBar } from '@/components/game/timer-bar';
import { GameColors } from '@/constants/game-theme';
import scenariosData from '@/data/scenarios.json';
import type { Outcome, Scenario } from '@/data/types';
import { calculateStreakBonus, getRoundConfig, getStreakMultiplier, resolveBet, type BetResult } from '@/game';
import { shuffleArray } from '@/lib/shuffle';
import { loadBalance, loadRecord, saveBalance, saveRecord } from '@/lib/storage';

const scenarios = scenariosData as Scenario[];
const TOTAL_ROUNDS = 10;
const STARTING_BALANCE = 1000;

export default function RoundScreen() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [sessionScenarios, setSessionScenarios] = useState(() => shuffleArray(scenarios));
  const [roundIndex, setRoundIndex] = useState(0);
  const [balance, setBalance] = useState(STARTING_BALANCE);
  const [record, setRecord] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState<Outcome | null>(null);
  const [selectedBet, setSelectedBet] = useState(50);
  const [betResult, setBetResult] = useState<BetResult | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [streakPot, setStreakPot] = useState(0);
  const [forfeitedBonus, setForfeitedBonus] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  const isSessionComplete = roundIndex >= TOTAL_ROUNDS;

  useEffect(() => {
    (async () => {
      const [loadedBalance, loadedRecord] = await Promise.all([
        loadBalance(STARTING_BALANCE),
        loadRecord(0),
      ]);
      setBalance(loadedBalance);
      setRecord(loadedRecord);
      setIsLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    saveBalance(balance).catch(() => {});
  }, [balance, isLoaded]);

  useEffect(() => {
    if (!isLoaded || !isSessionComplete) return;
    if (balance > record) {
      setRecord(balance);
      saveRecord(balance).catch(() => {});
      setIsNewRecord(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSessionComplete]);

  function handlePlayAgain() {
    setSessionScenarios(shuffleArray(scenarios));
    setRoundIndex(0);
    setBalance(STARTING_BALANCE);
    setIsNewRecord(false);
    setSelectedOutcome(null);
    setSelectedBet(50);
    setBetResult(null);
    setTimedOut(false);
    setStreakCount(0);
    setStreakPot(0);
    setForfeitedBonus(0);
    setCorrectCount(0);
    setMaxStreak(0);
  }

  if (!isLoaded) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator color={GameColors.accent} size="large" />
      </View>
    );
  }

  if (isSessionComplete) {
    return (
      <SessionSummary
        balance={balance}
        record={record}
        isNewRecord={isNewRecord}
        maxStreak={maxStreak}
        correctCount={correctCount}
        totalRounds={TOTAL_ROUNDS}
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  const round = roundIndex + 1;
  const scenario = sessionScenarios[roundIndex];
  const roundConfig = getRoundConfig(round);
  const isResolved = betResult !== null;
  const streakMultiplier = getStreakMultiplier(streakCount);

  function applyStreakOutcome(result: BetResult) {
    if (result.correct) {
      setCorrectCount((current) => current + 1);
      const newStreakCount = streakCount + 1;
      const multiplier = getStreakMultiplier(newStreakCount);
      const bonus = calculateStreakBonus(selectedBet, multiplier);
      setStreakCount(newStreakCount);
      setStreakPot((current) => current + bonus);
      setMaxStreak((current) => Math.max(current, newStreakCount));
      setForfeitedBonus(0);
    } else {
      setForfeitedBonus(streakPot);
      setStreakCount(0);
      setStreakPot(0);
    }
  }

  function handleSelectOutcome(outcome: Outcome) {
    if (isResolved) return;

    const result = resolveBet(scenario, outcome, selectedBet);
    setSelectedOutcome(outcome);
    setBetResult(result);
    setBalance((current) => current + result.netChange);
    applyStreakOutcome(result);

    Haptics.notificationAsync(
      result.correct
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Error
    ).catch(() => {});
  }

  function handleTimerExpire() {
    if (isResolved) return;

    const result: BetResult = { correct: false, payout: 0, netChange: -selectedBet };
    setBetResult(result);
    setTimedOut(true);
    setBalance((current) => current + result.netChange);
    applyStreakOutcome(result);

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
  }

  function handleCashOut() {
    setBalance((current) => current + streakPot);
    setStreakPot(0);
    setStreakCount(0);
  }

  function handleNext() {
    setRoundIndex((current) => current + 1);
    setSelectedOutcome(null);
    setBetResult(null);
    setTimedOut(false);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <GameHeader
        roundNumber={round}
        totalRounds={TOTAL_ROUNDS}
        streak={streakCount}
        streakMultiplier={streakMultiplier}
        streakBonus={streakPot}
        balance={balance}
      />

      <TimerBar
        key={scenario.id}
        durationSeconds={roundConfig.timeLimitSeconds}
        running={!isResolved}
        onExpire={handleTimerExpire}
      />

      <MatchupCard scenario={scenario} />

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>APOSTE NO RESULTADO</Text>
        <OutcomeButtons
          scenario={scenario}
          selected={selectedOutcome}
          onSelect={handleSelectOutcome}
          disabled={isResolved}
          revealedResult={isResolved ? scenario.result : null}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>VALOR DA APOSTA</Text>
        <BetAmountSelector selected={selectedBet} onSelect={setSelectedBet} disabled={isResolved} />
      </View>

      {betResult && <RevealCard reveal={scenario.reveal} />}

      {betResult && (
        <ResultPanel
          result={betResult}
          timedOut={timedOut}
          streakCount={streakCount}
          streakMultiplier={streakMultiplier}
          streakBonus={streakPot}
          forfeitedBonus={forfeitedBonus}
          onCashOut={handleCashOut}
          onNext={handleNext}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: GameColors.background,
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: GameColors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingTop: 8,
    paddingBottom: 40,
    gap: 22,
  },
  section: {
    gap: 10,
  },
  sectionLabel: {
    color: GameColors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    paddingHorizontal: 20,
  },
});
