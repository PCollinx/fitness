"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FaArrowLeft, FaPlus, FaTrash, FaSave } from "react-icons/fa";

interface WorkoutExercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: number;
  weight: number | null;
  order: number;
}

interface Workout {
  id: string;
  name: string;
  description: string;
  image: string;
  isOwner: boolean;
  exercises: WorkoutExercise[];
}

interface ExerciseOption {
  id: string;
  name: string;
  muscleGroup: string;
}

export default function EditWorkoutPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [availableExercises, setAvailableExercises] = useState<ExerciseOption[]>([]);
  
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);

  const workoutId = params.id as string;

  useEffect(() => {
    const loadWorkout = async () => {
      if (!workoutId) return;
      
      setIsLoading(true);
      
      try {
        const [workoutResponse, exercisesResponse] = await Promise.all([
          fetch(`/api/workouts/${workoutId}`),
          fetch('/api/exercises')
        ]);
        
        if (!workoutResponse.ok) {
          throw new Error("Failed to load workout");
        }
        
        const workoutData = await workoutResponse.json();
        
        if (!workoutData.isOwner) {
          router.push(`/workouts/${workoutId}`);
          return;
        }
        
        setWorkout(workoutData);
        setName(workoutData.name);
        setDescription(workoutData.description);
        setExercises(workoutData.exercises);
        
        if (exercisesResponse.ok) {
          const exercisesData = await exercisesResponse.json();
          setAvailableExercises(exercisesData);
        }
      } catch (err) {
        console.error("Error loading workout:", err);
        router.push("/workouts");
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkout();
  }, [workoutId, router]);

  const addExercise = () => {
    if (availableExercises.length === 0) return;
    
    const firstExercise = availableExercises[0];
    const newExercise: WorkoutExercise = {
      id: `new-${Date.now()}`,
      name: firstExercise.name,
      muscleGroup: firstExercise.muscleGroup,
      sets: 3,
      reps: 10,
      weight: null,
      order: exercises.length,
    };
    
    setExercises([...exercises, newExercise]);
  };

  const removeExercise = (index: number) => {
    const newExercises = exercises.filter((_, i) => i !== index);
    // Update order
    const reorderedExercises = newExercises.map((ex, i) => ({
      ...ex,
      order: i,
    }));
    setExercises(reorderedExercises);
  };

  const updateExercise = (index: number, field: keyof WorkoutExercise, value: any) => {
    const newExercises = [...exercises];
    newExercises[index] = {
      ...newExercises[index],
      [field]: value,
    };
    setExercises(newExercises);
  };

  const saveWorkout = async () => {
    if (!name.trim() || exercises.length === 0) return;
    
    setIsSaving(true);
    
    try {
      const response = await fetch(`/api/workouts/${workoutId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          exercises: exercises.map((ex, index) => ({
            ...ex,
            order: index,
          })),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save workout');
      }
      
      router.push(`/workouts/${workoutId}`);
    } catch (err) {
      console.error('Error saving workout:', err);
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/3 mb-6"></div>
            <div className="h-32 bg-gray-800 rounded-lg mb-6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-4xl mx-auto text-center py-16">
          <h2 className="text-xl font-bold text-white mb-3">Workout Not Found</h2>
          <button
            onClick={() => router.push("/workouts")}
            className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 rounded-lg font-medium transition"
          >
            Back to Workouts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 mt-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push(`/workouts/${workoutId}`)}
            className="flex items-center text-yellow-400 hover:text-yellow-300 transition"
          >
            <FaArrowLeft className="mr-2" />
            Back to Workout
          </button>
          
          <button
            onClick={saveWorkout}
            disabled={isSaving || !name.trim() || exercises.length === 0}
            className="bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-black px-6 py-3 rounded-lg font-bold flex items-center transition"
          >
            <FaSave className="mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <h1 className="text-3xl font-bold text-white mb-8">Edit Workout</h1>

        {/* Basic Info */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-300 mb-2">
                Workout Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
                placeholder="Enter workout name"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
                placeholder="Enter workout description"
              />
            </div>
          </div>
        </div>

        {/* Exercises */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Exercises</h2>
            <button
              onClick={addExercise}
              className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded-lg font-medium flex items-center transition"
            >
              <FaPlus className="mr-2" />
              Add Exercise
            </button>
          </div>

          {exercises.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No exercises added yet. Click "Add Exercise" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {exercises.map((exercise, index) => (
                <div
                  key={exercise.id || index}
                  className="bg-gray-700 p-4 rounded-lg border border-gray-600"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <span className="bg-yellow-400 text-black w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3">
                        {index + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-white">
                        Exercise {index + 1}
                      </h3>
                    </div>
                    
                    <button
                      onClick={() => removeExercise(index)}
                      className="text-red-400 hover:text-red-300 transition p-2"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">
                        Exercise
                      </label>
                      <select
                        value={exercise.name}
                        onChange={(e) => {
                          const selected = availableExercises.find(ex => ex.name === e.target.value);
                          if (selected) {
                            updateExercise(index, 'name', selected.name);
                            updateExercise(index, 'muscleGroup', selected.muscleGroup);
                          }
                        }}
                        className="w-full bg-gray-600 text-white px-3 py-2 rounded border border-gray-500 focus:border-yellow-400 focus:outline-none"
                      >
                        {availableExercises.map((ex) => (
                          <option key={ex.id} value={ex.name}>
                            {ex.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-1">
                        Sets
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={exercise.sets}
                        onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 1)}
                        className="w-full bg-gray-600 text-white px-3 py-2 rounded border border-gray-500 focus:border-yellow-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-1">
                        Reps
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={exercise.reps}
                        onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value) || 1)}
                        className="w-full bg-gray-600 text-white px-3 py-2 rounded border border-gray-500 focus:border-yellow-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-1">
                        Weight (lbs)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={exercise.weight || ''}
                        onChange={(e) => updateExercise(index, 'weight', e.target.value ? parseFloat(e.target.value) : null)}
                        className="w-full bg-gray-600 text-white px-3 py-2 rounded border border-gray-500 focus:border-yellow-400 focus:outline-none"
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="text-sm text-gray-400 capitalize">
                      Target: {exercise.muscleGroup.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}